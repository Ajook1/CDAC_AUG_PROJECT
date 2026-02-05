// auth/authMiddleware.js

const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
const pool = require('../utils/db');
const { createResult } = require('../utils/result');

function authOwner(req, res, next) {
    const authHeader = req.headers.authorization;

    // 1️⃣ Check header
    if (!authHeader) {
        return res.send(createResult('Token missing'));
    }

    // Expected: Bearer <token>
    const parts = authHeader.split(' ');
    if (parts.length !== 2) {
        return res.send(createResult('Invalid Authorization header'));
    }

    const token = parts[1];

    // 2️⃣ Verify token FIRST (sync-safe)
    let decoded;
    try {
        decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
        return res.send(createResult('Invalid or expired token'));
    }

    // 3️⃣ Verify user from DB
    const sql = `
        SELECT u.user_id, u.is_active, r.role_name
        FROM users u
        JOIN roles r ON u.role_id = r.role_id
        WHERE u.user_id = ?
    `;

    pool.query(sql, [decoded.user_id], (err, rows) => {
        if (err) return res.send(createResult(err));

        if (!rows.length) {
            return res.send(createResult('User not found'));
        }

        const user = rows[0];

        if (!user.is_active) {
            return res.send(createResult('Account deactivated'));
        }

        if (user.role_name !== 'OWNER') {
            return res.send(createResult('Not an owner account'));
        }

        // 4️⃣ Attach user & continue
        req.user = {
            user_id: user.user_id,
            role_name: user.role_name
        };

        next();
    });
}

module.exports = authOwner;
