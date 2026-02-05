// routes/ownerNotifications.js

// Import express
const express = require('express');

// Import database connection
const pool = require('../../utils/db');

// Import common response formatter
const { createResult } = require('../../utils/result');

// Import owner authentication middleware
const authOwner = require('../../auth/authMiddleware');

// Create router
const router = express.Router();

/* =====================================================
   GET /owner/notifications
   List all notifications for the logged-in owner
   ===================================================== */
router.get('/owner/notifications', authOwner, (req, res) => {

    const sql = `
        SELECT
            notification_id,
            message,
            is_read,
            created_at
        FROM notifications
        WHERE user_id = ?
        ORDER BY created_at DESC
    `;

    pool.query(sql, [req.user.user_id], (err, rows) => {
        if (err) return res.send(createResult(err));
        res.send(createResult(null, rows));
    });
});

/* =====================================================
   PATCH /owner/notifications/:notification_id/read
   Mark a notification as read
   ===================================================== */
router.patch('/owner/notifications/:notification_id/read', authOwner, (req, res) => {

    const { notification_id } = req.params;

    const sql = `
        UPDATE notifications
        SET is_read = 1
        WHERE notification_id = ? AND user_id = ?
    `;

    pool.query(sql, [notification_id, req.user.user_id], (err, result) => {
        if (err) return res.send(createResult(err));

        if (result.affectedRows === 0) {
            return res.send(createResult('Notification not found'));
        }

        res.send(
            createResult(null, {
                message: 'Notification marked as read'
            })
        );
    });
});

/* =====================================================
   DELETE /owner/notifications/:notification_id
   Delete a specific notification
   ===================================================== */
router.delete('/owner/notifications/:notification_id', authOwner, (req, res) => {

    const { notification_id } = req.params;

    const sql = `
        DELETE FROM notifications
        WHERE notification_id = ? AND user_id = ?
    `;

    pool.query(sql, [notification_id, req.user.user_id], (err, result) => {
        if (err) return res.send(createResult(err));

        if (result.affectedRows === 0) {
            return res.send(createResult('Notification not found'));
        }

        res.send(
            createResult(null, {
                message: 'Notification deleted successfully'
            })
        );
    });
});

module.exports = router;
