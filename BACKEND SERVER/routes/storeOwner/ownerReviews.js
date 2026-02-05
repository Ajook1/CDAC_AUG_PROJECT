


const express = require('express');

const pool = require('../../utils/db');

const { createResult } = require('../../utils/result');

const authOwner = require('../../auth/authMiddleware');

const router = express.Router();


router.get('/owner/reviews', authOwner, (req, res) => {


    const sql = `
        SELECT
            r.review_id,
            r.rating,
            r.comment,
            r.review_date,
            r.extra1 AS owner_reply,
            b.title AS book_title,
            u.name AS customer_name
        FROM reviews r
        JOIN books b ON r.book_id = b.book_id
        JOIN users u ON r.user_id = u.user_id
        JOIN book_inventory bi ON b.book_id = bi.book_id
        JOIN bookstores s ON bi.store_id = s.store_id
        WHERE s.owner_id = ?
        ORDER BY r.review_date DESC
    `;

    pool.query(sql, [req.user.user_id], (err, rows) => {
        if (err) return res.send(createResult(err));
        res.send(createResult(null, rows));
    });
});


router.post('/owner/reviews/:review_id/reply', authOwner, (req, res) => {

    const { review_id } = req.params;
    const { reply } = req.body;

    if (!reply) {
        return res.send(createResult('Reply text is required'));
    }


    const sql = `
        UPDATE reviews r
        JOIN books b ON r.book_id = b.book_id
        JOIN book_inventory bi ON b.book_id = bi.book_id
        JOIN bookstores s ON bi.store_id = s.store_id
        SET r.extra1 = ?
        WHERE r.review_id = ? AND s.owner_id = ?
    `;

    pool.query(sql, [reply, review_id, req.user.user_id], (err, result) => {
        if (err) return res.send(createResult(err));

        if (result.affectedRows === 0) {
            return res.send(createResult('Review not found or unauthorized'));
        }

        res.send(
            createResult(null, {
                message: 'Reply posted successfully'
            })
        );
    });
});

module.exports = router;
