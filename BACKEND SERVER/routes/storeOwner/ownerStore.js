// routes/ownerStore.js
const express = require('express');
// const multer = require('multer');
const path = require('path');

const pool = require('../../utils/db');
const { createResult } = require('../../utils/result');
const authOwner = require('../../auth/authMiddleware');

const router = express.Router();
const db = pool.promise();
const upload = require('../../auth/upload');

// file upload setup
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => cb(null, 'uploads/'),
//     filename: (req, file, cb) =>
//         cb(null, Date.now() + path.extname(file.originalname))
// });

// const upload = multer({ storage });

//create store
router.post('/', authOwner, async (req, res) => {
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
router.get('/', authOwner, async (req, res) => {
    try {
        const sql = `SELECT * FROM bookstores WHERE owner_id = ?`;
        const [stores] = await db.query(sql, [req.user.user_id]);
        res.send(createResult(null, stores));
    } catch (err) {
        res.send(createResult(err));
    }
});

// GET SINGLE STORE FOR THE OWNER 
router.get('/:store_id', authOwner, async (req, res) => {
    try {
        const sql = `
      SELECT * FROM bookstores
      WHERE owner_id = ? AND store_id = ?
    `;

        const [rows] = await db.query(sql, [
            req.user.user_id,
            req.params.store_id
        ]);

        if (!rows.length) {
            return res.send(createResult('Store not found'));
        }

        res.send(createResult(null, rows[0]));
    } catch (err) {
        res.send(createResult(err));
    }
});

// Update store details by the store id for the owner
router.put('/:store_id', authOwner, async (req, res) => {
    try {
        const allowedFields = [
            'store_name',
            'description',
            'address_line',
            'city',
            'state',
            'postal_code',
            'country',
            'contact_email',
            'contact_phone'
        ];

        const updates = [];
        const values = [];

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates.push(`${field} = ?`);
                values.push(req.body[field]);
            }
        }

        if (updates.length === 0) {
            return res.send(createResult('No fields to update'));
        }

        values.push(req.params.store_id, req.user.user_id);

        const sql = `
      UPDATE bookstores
      SET ${updates.join(', ')}
      WHERE store_id = ? AND owner_id = ?
    `;

        const [result] = await db.query(sql, values);

        if (!result.affectedRows) {
            return res.send(createResult('Store not found or unauthorized'));
        }

        res.send(createResult(null, { message: 'Store updated successfully' }));
    } catch (err) {
        res.send(createResult(err));
    }
});

// update store active status it is active or not
router.patch('/:store_id/status', authOwner, async (req, res) => {
    try {
        const { is_active } = req.body;

        const sql = `
      UPDATE bookstores
      SET is_active = ?
      WHERE store_id = ? AND owner_id = ?
    `;

        const [result] = await db.query(sql, [
            is_active ? 1 : 0,
            req.params.store_id,
            req.user.user_id
        ]);

        if (!result.affectedRows) {
            return res.send(createResult('Store not found or unauthorized'));
        }

        res.send(createResult(null, { message: 'Store status updated' }));
    } catch (err) {
        res.send(createResult(err));
    }
});

// upload store image for 
// upload store image
router.post(
    '/:store_id/image',
    authOwner,
    upload.single('image'),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.send(createResult('Image file required'));
            }

            // ⭐ FIX: save relative URL, not filesystem path
            const imagePath = `uploads/${req.file.filename}`;

            const sql = `
                UPDATE bookstores
                SET store_image = ?
                WHERE store_id = ? AND owner_id = ?
            `;

            const [result] = await db.query(sql, [
                imagePath,
                req.params.store_id,
                req.user.user_id
            ]);

            if (!result.affectedRows) {
                return res.send(createResult('Store not found or unauthorized'));
            }

            res.send(
                createResult(null, {
                    message: 'Store image uploaded successfully',
                    image_path: imagePath
                })
            );
        } catch (err) {
            res.send(createResult(err));
        }
    }
);


module.exports = router;
