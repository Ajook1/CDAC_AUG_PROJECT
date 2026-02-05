const express = require("express");
const router = express.Router();
const pool = require("../../utils/db");
const result = require("../../utils/result");
const authorizeUser = require("../../auth/authUser");
const bcrypt = require("bcryptjs");

// GET PROFILE
router.get("/", authorizeUser, (req, res) => {
    pool.query(
        "SELECT user_id, name, email, phone FROM users WHERE user_id=?",
        [req.user.user_id],
        (err, data) => {
            if (err) return res.send(result.createResult(err));
            res.send(result.createResult(null, data[0]));
        }
    );
});

// UPDATE PROFILE
router.put("/", authorizeUser, (req, res) => {
    const { name, phone } = req.body;

    pool.query(
        "UPDATE users SET name=?, phone=? WHERE user_id=?",
        [name, phone, req.user.user_id],
        err => {
            if (err) return res.send(result.createResult(err));
            res.send(result.createResult(null, "Profile updated"));
        }
    );
});

// CHANGE PASSWORD
router.put("/password", authorizeUser, async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    pool.query(
        "SELECT password_hash FROM users WHERE user_id=?",
        [req.user.user_id],
        async (err, rows) => {
            const match = await bcrypt.compare(oldPassword, rows[0].password_hash);
            if (!match)
                return res.send(result.createResult("Old password incorrect"));

            const hash = await bcrypt.hash(newPassword, 10);
            pool.query(
                "UPDATE users SET password_hash=? WHERE user_id=?",
                [hash, req.user.user_id],
                () => res.send(result.createResult(null, "Password changed"))
            );
        }
    );
});

module.exports = router;
