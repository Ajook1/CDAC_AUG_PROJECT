
const express = require('express');


const pool = require('../../utils/db');

const { createResult } = require('../../utils/result');


const authOwner = require('../../auth/authMiddleware');

const router = express.Router();

//List all customer orders for owner's bookstore

router.get('/', authOwner, (req, res) => {


    const sql = `
        SELECT DISTINCT
            o.order_id,
            o.order_date,
            o.status,
            o.total_amount,
            u.name AS customer_name
        FROM orders o
        JOIN users u ON o.user_id = u.user_id
        JOIN order_items oi ON o.order_id = oi.order_id
        JOIN book_inventory bi ON oi.inventory_id = bi.inventory_id
        JOIN bookstores s ON bi.store_id = s.store_id
        WHERE s.owner_id = ?
        ORDER BY o.order_date DESC
    `;

    pool.query(sql, [req.user.user_id], (err, rows) => {
        if (err) return res.send(createResult(err));
        res.send(createResult(null, rows));
    });
});

// Fetch complete details of a specific order
router.get('/:order_id', authOwner, (req, res) => {

    const { order_id } = req.params;

    const sql = `
        SELECT
            o.order_id,
            o.order_date,
            o.status,
            o.total_amount,
            b.title,
            oi.quantity,
            oi.price
        FROM orders o
        JOIN order_items oi ON o.order_id = oi.order_id
        JOIN book_inventory bi ON oi.inventory_id = bi.inventory_id
        JOIN books b ON bi.book_id = b.book_id
        JOIN bookstores s ON bi.store_id = s.store_id
        WHERE s.owner_id = ? AND o.order_id = ?
    `;

    pool.query(sql, [req.user.user_id, order_id], (err, rows) => {
        if (err) return res.send(createResult(err));
        res.send(createResult(null, rows));
    });
});


router.patch('/:order_id/cancel', authOwner, (req, res) => {

    const { order_id } = req.params;

    const sql = `
        UPDATE orders o
        JOIN order_items oi ON o.order_id = oi.order_id
        JOIN book_inventory bi ON oi.inventory_id = bi.inventory_id
        JOIN bookstores s ON bi.store_id = s.store_id
        SET o.status = 'Cancelled'
        WHERE s.owner_id = ? AND o.order_id = ?
    `;

    pool.query(sql, [req.user.user_id, order_id], (err) => {
        if (err) return res.send(createResult(err));

        res.send(
            createResult(null, {
                message: 'Order cancelled successfully'
            })
        );
    });
});

module.exports = router;
