const express = require('express');
const multer = require('multer');
const path = require('path');

const pool = require('../utils/db');
const { createResult } = require('../utils/result');
const authOwner = require('../auth/authMiddleware');

const router = express.Router();
const db = pool.promise();

// ====================== MULTER CONFIG ======================
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) =>
        cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

// ====================== CREATE STORE ======================
router.post('/owner/store', authOwner, async (req, res) => {
    try {
        const { store_name, contact_email } = req.body;

        if (!store_name) {
            return res.send(createResult('store_name is required'));
        }

        const sql = `
      INSERT INTO bookstores (owner_id, store_name, contact_email, is_active)
      VALUES (?, ?, ?, 1)
    `;

        const [result] = await db.query(sql, [
            req.user.user_id,
            store_name,
            contact_email || null
        ]);

        res.send(
            createResult(null, {
                message: 'Store created successfully',
                store_id: result.insertId
            })
        );
    } catch (err) {
        res.send(createResult(err));
    }
});

// Get all store for the owner 
router.get('/owner/stores', authOwner, async (req, res) => {
    try {
        const sql = `SELECT * FROM bookstores WHERE owner_id = ?`;
        const [stores] = await db.query(sql, [req.user.user_id]);
        res.send(createResult(null, stores));
    } catch (err) {
        res.send(createResult(err));
    }
});