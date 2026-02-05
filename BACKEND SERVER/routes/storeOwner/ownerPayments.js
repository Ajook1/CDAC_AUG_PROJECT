
const express = require('express');

const pool = require('../../utils/db');

const { createResult } = require('../../utils/result');

const authOwner = require('../../auth/authMiddleware');

const router = express.Router();

router.get('/owner/payments', authOwner, (req, res) => {

    /*
      We fetch payments only for orders
      that belong to this owner's bookstore
    */
    const sql = `
        SELECT DISTINCT
            p.payment_id,
            p.payment_method,
            p.payment_status,
            p.transaction_id,
            p.payment_date,
            o.order_id,
            o.total_amount
        FROM payments p
        JOIN orders o ON p.order_id = o.order_id
        JOIN order_items oi ON o.order_id = oi.order_id
        JOIN book_inventory bi ON oi.inventory_id = bi.inventory_id
        JOIN bookstores s ON bi.store_id = s.store_id
        WHERE s.owner_id = ?
        ORDER BY p.payment_date DESC
    `;

    pool.query(sql, [req.user.user_id], (err, rows) => {
        if (err) return res.send(createResult(err));
        res.send(createResult(null, rows));
    });
});


router.get('/owner/payments/:payment_id', authOwner, (req, res) => {

    const { payment_id } = req.params;

    const sql = `
        SELECT
            p.payment_id,
            p.payment_method,
            p.payment_status,
            p.transaction_id,
            p.payment_date,
            o.order_id,
            o.total_amount
        FROM payments p
        JOIN orders o ON p.order_id = o.order_id
        JOIN order_items oi ON o.order_id = oi.order_id
        JOIN book_inventory bi ON oi.inventory_id = bi.inventory_id
        JOIN bookstores s ON bi.store_id = s.store_id
        WHERE s.owner_id = ? AND p.payment_id = ?
    `;

    pool.query(sql, [req.user.user_id, payment_id], (err, rows) => {
        if (err) return res.send(createResult(err));
        res.send(createResult(null, rows[0] || null));
    });
});

module.exports = router;
