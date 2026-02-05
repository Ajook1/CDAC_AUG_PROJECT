console.log("🔥 THIS AUTH.ROUTES FILE IS RUNNING");
console.log("✅ USER AUTH ROUTES LOADED");
console.log("🔥 AUTH.ROUTES.JS LOADED");

const express = require("express");
const router = express.Router();
const pool = require("../../utils/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../../config");
const sendOTP = require("../../utils/mailer");


const { createResult } = require("../../utils/result"); // ✅ ADD THIS

router.get("/test", (req, res) => {
  res.send("AUTH ROUTE WORKING");
});


/* ===================== SIGNUP ===================== */
// routes/user/auth.js (or similar)

router.post("/signup", async (req, res) => {
  console.log("🔥 USER SIGNUP HIT");
  console.log("👉 DB NAME:", process.env.DB_NAME);
  console.log("👉 DB HOST:", process.env.DB_HOST);
    try {
        const { name, email, phone, password } = req.body;

        if (!name || !email || !phone || !password) {
            return res.json(createResult("All fields are required"));
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = `
          INSERT INTO users (role_id, name, email, password_hash, phone)
          VALUES (?, ?, ?, ?, ?)
        `;

        await pool.execute(sql, [
            2,
            name,
            email,
            hashedPassword,
            phone
        ]);

        return res.json(createResult(null, "Signup successful"));

    } catch (err) {
        console.error("Signup error:", err);

        if (err.code === "ER_DUP_ENTRY") {
            if (err.sqlMessage.includes("email")) {
                return res.json(createResult("Email already registered"));
            }
            if (err.sqlMessage.includes("phone")) {
                return res.json(createResult("Phone number already registered"));
            }
        }

        // return res.json(createResult("Signup failed"));

      return res.status(500).json({
  error: err.message,
  sqlMessage: err.sqlMessage
});
    }
});



/* ===================== LOGIN ===================== */
router.post("/signin", (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ? AND is_active = 1";
    pool.query(sql, [email], async (err, users) => {
        if (users.length === 0) {
            return res.json({ status: "error", message: "User not found" });
        }

        const user = users[0];
        const match = await bcrypt.compare(password, user.password_hash);

        if (!match) {
            return res.json({ status: "error", message: "Invalid password" });
        }

        const token = jwt.sign(
            { user_id: user.user_id, role_id: user.role_id },
            config.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            status: "success",
            token,
            user: {
                user_id: user.user_id,
                name: user.name,
                email: user.email
            }
        });
    });
});

/* ===================== FORGOT PASSWORD - SEND OTP ===================== */
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    // 1. Check user exists
    const [users] = await pool.promise().query(
      "SELECT user_id FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.json({ status: "error", message: "Email not registered" });
    }

    const userId = users[0].user_id;

    // 2. Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 3. Expiry time (5 mins)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // 4. Save OTP
    await pool.promise().query(
      "INSERT INTO password_otps (user_id, otp, expires_at) VALUES (?, ?, ?)",
      [userId, otp, expiresAt]
    );

    // 5. Send mail
    await sendOTP(email, otp);

    res.json({ status: "success", message: "OTP sent to email" });
  } catch (err) {
    console.error(err);
    res.json({ status: "error", message: "Failed to send OTP" });
  }
});

router.get("/check", (req, res) => {
  res.send("CHECK OK");
});

/* ===================== VERIFY OTP ===================== */
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  try {
    // 1. Get user
    const [users] = await pool.promise().query(
      "SELECT user_id FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.json({ status: "error", message: "User not found" });
    }

    const userId = users[0].user_id;

    // 2. Check OTP
    const [records] = await pool.promise().query(
      `SELECT * FROM password_otps 
       WHERE user_id = ? AND otp = ? 
       AND expires_at > NOW()
       ORDER BY created_at DESC LIMIT 1`,
      [userId, otp]
    );

    if (records.length === 0) {
      return res.json({ status: "error", message: "Invalid or expired OTP" });
    }

    res.json({ status: "success", message: "OTP verified" });
  } catch (err) {
    console.error(err);
    res.json({ status: "error", message: "OTP verification failed" });
  }
});

/* ===================== RESET PASSWORD ===================== */
router.post("/reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    // 1. Check user
    const [users] = await pool.promise().query(
      "SELECT user_id FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.json({ status: "error", message: "User not found" });
    }

    const userId = users[0].user_id;

    // 2. Validate OTP again (security)
    const [records] = await pool.promise().query(
      `SELECT * FROM password_otps 
       WHERE user_id = ? AND otp = ?
       AND expires_at > NOW()
       ORDER BY created_at DESC LIMIT 1`,
      [userId, otp]
    );

    if (records.length === 0) {
      return res.json({ status: "error", message: "Invalid or expired OTP" });
    }

    // 3. Hash new password
    const hashed = await bcrypt.hash(newPassword, 10);

    // 4. Update password
    await pool.promise().query(
      "UPDATE users SET password_hash = ? WHERE user_id = ?",
      [hashed, userId]
    );

    // 5. Delete used OTPs
    await pool.promise().query(
      "DELETE FROM password_otps WHERE user_id = ?",
      [userId]
    );

    res.json({ status: "success", message: "Password reset successful" });

  } catch (err) {
    console.error(err);
    res.json({ status: "error", message: "Password reset failed" });
  }
});



module.exports = router;
