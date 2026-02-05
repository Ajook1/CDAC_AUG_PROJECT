
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendOTP = require("../../utils/mailer");



const pool = require('../../utils/db');
const { createResult } = require('../../utils/result');
const { JWT_SECRET, BCRYPT_SALT_ROUNDS } = require('../../config');
const authOwner = require('../../auth/authMiddleware');

// Create router
const router = express.Router();


function getOwnerRoleId(callback) {
    const sql = 'SELECT role_id FROM roles WHERE role_name = ?';

    pool.query(sql, ['OWNER'], (err, rows) => {
        if (err) return callback(err);


        if (rows.length > 0) {
            return callback(null, rows[0].role_id);
        }


        const insertSql = 'INSERT INTO roles (role_name) VALUES (?)';
        pool.query(insertSql, ['OWNER'], (err2, result) => {
            if (err2) return callback(err2);
            callback(null, result.insertId);
        });
    });
}

router.post('/register', (req, res) => {
    const { name, email, password, phone } = req.body;

    // 🔹 Basic validation
    if (!name || !email || !password) {
        return res.send(createResult('Name, email and password are required'));
    }

    // 🔹 Phone validation (ONLY if provided)
    if (phone && !/^[0-9]{10}$/.test(phone)) {
        return res.send(
            createResult('Phone number must be exactly 10 digits')
        );
    }

    // 🔹 Check if email already exists
    const checkSql = 'SELECT user_id FROM users WHERE email = ?';
    pool.query(checkSql, [email], (err, rows) => {
        if (err) return res.send(createResult(err));

        if (rows.length > 0) {
            return res.send(createResult('Email already registered'));
        }

        // 🔹 Get OWNER role
        getOwnerRoleId((roleErr, roleId) => {
            if (roleErr) return res.send(createResult(roleErr));

            const hashedPassword = bcrypt.hashSync(
                password,
                BCRYPT_SALT_ROUNDS
            );

            const insertSql = `
                INSERT INTO users (role_id, name, email, password_hash, phone)
                VALUES (?, ?, ?, ?, ?)
            `;

            pool.query(
                insertSql,
                [roleId, name, email, hashedPassword, phone || null],
                (insertErr, result) => {
                    if (insertErr) {
                        // 🔥 HANDLE UNIQUE CONSTRAINT ERRORS
                        if (insertErr.code === 'ER_DUP_ENTRY') {
                            if (insertErr.sqlMessage.includes('phone')) {
                                return res.send(
                                    createResult('Phone number already registered')
                                );
                            }
                            if (insertErr.sqlMessage.includes('email')) {
                                return res.send(
                                    createResult('Email already registered')
                                );
                            }
                            return res.send(createResult('Duplicate entry found'));
                        }

                        return res.send(createResult(insertErr));
                    }

                    res.send(
                        createResult(null, {
                            message: 'Owner registered successfully',
                            user_id: result.insertId
                        })
                    );
                }
            );
        });
    });
});


router.post('/login', (req, res) => {
    const { email, password } = req.body;

    const sql = `
        SELECT u.*, r.role_name
        FROM users u
        JOIN roles r ON u.role_id = r.role_id
        WHERE u.email = ?
    `;

    pool.query(sql, [email], (err, rows) => {
        if (err) return res.send(createResult(err));
        if (!rows.length) return res.send(createResult('Invalid email or password'));

        const user = rows[0];

        // OWNER role
        if (user.role_name !== 'OWNER') {
            return res.send(createResult('Not an owner account'));
        }


        const match = bcrypt.compareSync(password, user.password_hash);
        if (!match) {
            return res.send(createResult('Invalid email or password'));
        }


        const token = jwt.sign(
            { user_id: user.user_id, role_name: user.role_name },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.send(
            createResult(null, {
                token,
                user: {
                    user_id: user.user_id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone
                }
            })
        );
    });
});


router.get('/profile', authOwner, (req, res) => {
    const sql = `
        SELECT user_id, name, email, phone, is_active, created_at
        FROM users
        WHERE user_id = ?
    `;

    pool.query(sql, [req.user.user_id], (err, rows) => {
        if (err) return res.send(createResult(err));
        res.send(createResult(null, rows[0]));
    });
});


router.put('/profile', authOwner, (req, res) => {
    const { name, phone } = req.body;

    // ✅ Server-side phone validation (extra safety)
    if (phone && !/^[0-9]{10}$/.test(phone)) {
        return res.send(createResult('Phone number must be exactly 10 digits'));
    }

    const sql = 'UPDATE users SET name=?, phone=? WHERE user_id=?';

    pool.query(sql, [name, phone || null, req.user.user_id], (err) => {
        if (err) {
            // ✅ UNIQUE constraint error
            if (err.code === 'ER_DUP_ENTRY') {
                return res.send(createResult('This phone number is already in use'));
            }

            return res.send(createResult(err));
        }

        res.send(createResult(null, 'Profile updated successfully'));
    });
});



router.put('/password', authOwner, (req, res) => {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        return res.send(createResult('Old and new passwords required'));
    }

    const sql = 'SELECT password_hash FROM users WHERE user_id=?';

    pool.query(sql, [req.user.user_id], (err, rows) => {
        if (err) return res.send(createResult(err));

        const match = bcrypt.compareSync(oldPassword, rows[0].password_hash);
        if (!match) {
            return res.send(createResult('Old password incorrect'));
        }

        const newHash = bcrypt.hashSync(newPassword, BCRYPT_SALT_ROUNDS);

        pool.query(
            'UPDATE users SET password_hash=? WHERE user_id=?',
            [newHash, req.user.user_id],
            (err2) => {
                if (err2) return res.send(createResult(err2));
                res.send(createResult(null, 'Password updated successfully'));
            }
        );
    });
});


router.delete('/account', authOwner, (req, res) => {
    const userId = req.user.user_id;

    pool.query(
        'UPDATE users SET is_active=0 WHERE user_id=?',
        [userId],
        (err) => {
            if (err) return res.send(createResult(err));

            pool.query(
                'UPDATE bookstores SET is_active=0 WHERE owner_id=?',
                [userId],
                (err2) => {
                    if (err2) return res.send(createResult(err2));
                    res.send(createResult(null, 'Owner account deactivated'));
                }
            );
        }
    );
});

router.post("/forgot-password", async (req, res) => {
    const { email } = req.body;

    try {
        const [users] = await pool.promise().query(`
        SELECT u.user_id
        FROM users u
        JOIN roles r ON u.role_id = r.role_id
        WHERE u.email = ? AND r.role_name = 'OWNER'
`       , [email]);


        if (users.length === 0) {
            return res.json({ status: "error", message: "Owner email not registered" });
        }

        const userId = users[0].user_id;
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        await pool.promise().query(
            "INSERT INTO password_otps (user_id, otp, expires_at) VALUES (?, ?, ?)",
            [userId, otp, expiresAt]
        );

        await sendOTP(email, otp);

        res.json({ status: "success", message: "OTP sent to email" });
    } catch (err) {
        console.error(err);
        res.json({ status: "error", message: "Failed to send OTP" });
    }
});


router.post("/reset-password", async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
        const [users] = await pool.promise().query(
            `SELECT u.user_id
            FROM users u
            JOIN roles r ON u.role_id = r.role_id
            WHERE u.email = ? AND r.role_name = 'OWNER'`,
            [email]
        );



        if (users.length === 0) {
            return res.json({ status: "error", message: "Owner not found" });
        }

        const userId = users[0].user_id;

        const [rows] = await pool.promise().query(
            "SELECT * FROM password_otps WHERE user_id=? AND otp=? AND expires_at > NOW()",
            [userId, otp]
        );

        if (rows.length === 0) {
            return res.json({ status: "error", message: "Invalid or expired OTP" });
        }

        const hashed = await bcrypt.hash(newPassword, 10);

        await pool.promise().query(
            "UPDATE users SET password_hash=? WHERE user_id=?",
            [hashed, userId]
        );

        await pool.promise().query(
            "DELETE FROM password_otps WHERE user_id=?",
            [userId]
        );

        res.json({ status: "success", message: "Password reset successful" });
    } catch (err) {
        console.error(err);
        res.json({ status: "error", message: "Reset failed" });
    }
});


module.exports = router;
