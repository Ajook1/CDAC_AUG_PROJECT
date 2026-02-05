// routes/ownerSales.js

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
   GET /owner/sales/report
   Detailed sales report within date range
   ===================================================== */
router.get('/owner/sales/report', authOwner, (req, res) => {

    // Optional query params: from & to dates
    const { from, to } = req.query;

    const sql = `
        SELECT
            o.order_id,
            o.order_date,
            o.status,
            o.total_amount
        FROM orders o
        JOIN order_items oi ON o.order_id = oi.order_id
        JOIN book_inventory bi ON oi.inventory_id = bi.inventory_id
        JOIN bookstores s ON bi.store_id = s.store_id
        WHERE s.owner_id = ?
          AND (? IS NULL OR o.order_date >= ?)
          AND (? IS NULL OR o.order_date <= ?)
        GROUP BY o.order_id
        ORDER BY o.order_date DESC
    `;

    pool.query(
        sql,
        [
            req.user.user_id,
            from || null,
            from || null,
            to || null,
            to || null
        ],
        (err, rows) => {
            if (err) return res.send(createResult(err));
            res.send(createResult(null, rows));
        }
    );
});

/* =====================================================
   GET /owner/sales/summary
   Summarized sales statistics for dashboard
   ===================================================== */
router.get('/owner/sales/summary', authOwner, (req, res) => {

    const sql = `
        SELECT
            COUNT(DISTINCT o.order_id) AS total_orders,
            SUM(o.total_amount) AS total_sales
        FROM orders o
        JOIN order_items oi ON o.order_id = oi.order_id
        JOIN book_inventory bi ON oi.inventory_id = bi.inventory_id
        JOIN bookstores s ON bi.store_id = s.store_id
        WHERE s.owner_id = ?
          AND o.status != 'Cancelled'
    `;

    pool.query(sql, [req.user.user_id], (err, rows) => {
        if (err) return res.send(createResult(err));

        // rows[0] contains aggregated values
        res.send(createResult(null, rows[0]));
    });
});

module.exports = router;
