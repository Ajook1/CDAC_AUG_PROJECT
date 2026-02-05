const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const pool = require("../utils/db");
const { createResult } = require("../utils/result");

function authUser(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.send(createResult("Token missing"));
    }

    const parts = authHeader.split(" ");
    if (parts.length !== 2) {
        return res.send(createResult("Invalid Authorization header"));
    }

    const token = parts[1];

    let decoded;
    try {
        decoded = jwt.verify(token, JWT_SECRET);
    } catch {
        return res.send(createResult("Invalid or expired token"));
    }

    const sql = `
    SELECT u.user_id, u.is_active, u.role_id, r.role_name
    FROM users u
    JOIN roles r ON u.role_id = r.role_id
    WHERE u.user_id = ?
  `;

    pool.query(sql, [decoded.user_id], (err, rows) => {
        if (err) return res.send(createResult(err));
        if (!rows.length) return res.send(createResult("User not found"));

        const user = rows[0];

        if (!user.is_active) {
            return res.send(createResult("Account deactivated"));
        }

        // ✅ NO ROLE CHECK HERE
        req.user = {
            user_id: user.user_id,
            role_id: user.role_id,
            role_name: user.role_name
        };

        next();
    });
}

module.exports = authUser;
