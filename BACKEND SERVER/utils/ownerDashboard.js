// routes/ownerDashboard.js

const express = require('express');
const pool = require('../../utils/db');
const { createResult } = require('../../utils/result');
const authOwner = require('../../auth/authMiddleware');

const router = express.Router();


// Helper: get owner's store_ids using email
const getOwnerStoresSubquery = `
    SELECT store_id 
    FROM bookstores 
    WHERE contact_email = (
        SELECT email FROM users WHERE user_id = ?
    )
`;


// ✅ TOTAL ORDERS
router.get('/owner/dashboard/orders', authOwner, (req, res) => {

    const sql = `
        SELECT COUNT(DISTINCT oi.order_id) AS total_orders
        FROM order_items oi
        JOIN book_inventory bi ON oi.inventory_id = bi.inventory_id
        WHERE bi.store_id IN (${getOwnerStoresSubquery})
    `;

    pool.query(sql, [req.user.user_id], (err, rows) => {
        if (err) return res.send(createResult(err));

        res.send(createResult(null, {
            total_orders: rows[0].total_orders || 0
        }));
    });
});


// ✅ TOTAL SALES
// ✅ TOTAL SALES
router.get('/owner/dashboard/sales', authOwner, (req, res) => {


    const sql = `
        SELECT SUM(oi.price * oi.quantity) AS total_sales
        FROM order_items oi
        JOIN book_inventory bi ON oi.inventory_id = bi.inventory_id
        JOIN bookstores bs ON bi.store_id = bs.store_id
        JOIN users u ON u.email = bs.contact_email
        WHERE u.user_id = ?
    `;

    pool.query(sql, [req.user.user_id], (err, rows) => {
        if (err) return res.send(createResult(err));

        res.send(createResult(null, {
            total_sales: rows[0].total_sales || 0
        }));
    });
});




// ✅ LOW STOCK
router.get('/owner/dashboard/low-stock', authOwner, (req, res) => {

    const sql = `
        SELECT COUNT(*) AS low_stock_count
        FROM book_inventory
        WHERE store_id IN (${getOwnerStoresSubquery})
          AND stock_quantity < 5
    `;

    pool.query(sql, [req.user.user_id], (err, rows) => {
        if (err) return res.send(createResult(err));

        res.send(createResult(null, {
            low_stock_count: rows[0].low_stock_count || 0
        }));
    });
});

module.exports = router;
