
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const pool = require('../utils/db');
const { createResult } = require('../utils/result');
const { JWT_SECRET, BCRYPT_SALT_ROUNDS } = require('../config');
const authOwner = require('../auth/authMiddleware');

const router = express.Router();


function getOwnerRoleId(callback) {
    const sql = 'SELECT role_id FROM roles WHERE role_name = ?';

    pool.query(sql, ['OWNER'], (err, rows) => {
        if (err) return callback(err);

        // If OWNER role exists, return role_id
        if (rows.length > 0) {
            return callback(null, rows[0].role_id);
        }

        // Else create OWNER role
        const insertSql = 'INSERT INTO roles (role_name) VALUES (?)';
        pool.query(insertSql, ['OWNER'], (err2, result) => {
            if (err2) return callback(err2);
            callback(null, result.insertId);
        });
    });
}

/* =====================================================
   POST /owner/register
   Register new bookstore owner
   ===================================================== */
router.post('/owner/register', (req, res) => {
    const { name, email, password, phone } = req.body;

    // Basic validation
    if (!name || !email || !password) {
        return res.send(createResult('Name, email and password are required'));
    }

    // Check if email already exists
    const checkSql = 'SELECT user_id FROM users WHERE email = ?';
    pool.query(checkSql, [email], (err, rows) => {
        if (err) return res.send(createResult(err));

        if (rows.length > 0) {
            return res.send(createResult('Email already registered'));
        }

        // Get OWNER role_id
        getOwnerRoleId((roleErr, roleId) => {
            if (roleErr) return res.send(createResult(roleErr));

            // Hash password
            const hashedPassword = bcrypt.hashSync(password, BCRYPT_SALT_ROUNDS);

            // Insert user
            const insertSql = `
                INSERT INTO users (role_id, name, email, password_hash, phone)
                VALUES (?, ?, ?, ?, ?)
            `;

            pool.query(
                insertSql,
                [roleId, name, email, hashedPassword, phone || null],
                (insertErr, result) => {
                    if (insertErr) return res.send(createResult(insertErr));

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



/* =====================================================
   POST /owner/login
   Login owner and return JWT token
   ===================================================== */
router.post('/owner/login', (req, res) => {
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

        // Ensure OWNER role
        if (user.role_name !== 'OWNER') {
            return res.send(createResult('Not an owner account'));
        }

        // Compare password
        const match = bcrypt.compareSync(password, user.password_hash);
        if (!match) {
            return res.send(createResult('Invalid email or password'));
        }

        // Create JWT token
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
