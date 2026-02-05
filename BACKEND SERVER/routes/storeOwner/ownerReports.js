// routes/ownerReports.js

// Import express
const express = require('express');


const pool = require('../../utils/db');

const { createResult } = require('../../utils/result');

const authOwner = require('../../auth/authMiddleware');


const router = express.Router();


router.get('/owner/reports/monthly', authOwner, (req, res) => {


  const sql = `
        SELECT
            DATE_FORMAT(o.order_date, '%Y-%m') AS month,
            COUNT(DISTINCT o.order_id) AS total_orders,
            SUM(o.total_amount) AS total_sales
        FROM orders o
        JOIN order_items oi ON o.order_id = oi.order_id
        JOIN book_inventory bi ON oi.inventory_id = bi.inventory_id
        JOIN bookstores s ON bi.store_id = s.store_id
        WHERE s.owner_id = ?
          AND o.status != 'Cancelled'
        GROUP BY month
        ORDER BY month DESC
    `;

  pool.query(sql, [req.user.user_id], (err, rows) => {
    if (err) {
      return res.send(createResult(err));
    }


    res.send(createResult(null, rows));
  });
});

module.exports = router;
