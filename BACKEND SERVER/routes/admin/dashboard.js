const express = require('express')
const pool = require('../../utils/db')
const result = require('../../utils/result')

const router = express.Router()

// TOTAL ORDERS

router.get('/total-orders', (req, res) => {
  const sql = `SELECT COUNT(*) AS totalOrders FROM orders`
  pool.query(sql, (err, data) => {
    res.send(result.createResult(err, data[0]))
  })
})


// LOW STOCK BOOKS
router.get('/low-stock', (req, res) => {
  const sql = `
    SELECT COUNT(DISTINCT book_id) AS lowStockBooks
    FROM book_inventory
    WHERE stock_quantity < 5 AND is_active = 1
  `
  pool.query(sql, (err, data) => {
    res.send(result.createResult(err, data[0]))
  })
})

// BLOCKED USERS

router.get('/blocked-users', (req, res) => {
  const sql = `
    SELECT COUNT(*) AS blockedUsers
    FROM users
    WHERE is_active = 0
  `
  pool.query(sql, (err, data) => {
    res.send(result.createResult(err, data[0]))
  })
})

// TODAY'S REVENUE

router.get('/today-revenue', (req, res) => {
  const sql = `
    SELECT IFNULL(SUM(total_amount), 0) AS todayRevenue
    FROM orders
    WHERE DATE(order_date) = CURDATE()
      AND LOWER(status) = 'delivered'
  `;
  pool.query(sql, (err, data) => {
    res.send(result.createResult(err, data[0]));
  });
});


router.get('/total-users', (req, res) => {
  const sql = `SELECT COUNT(*) AS totalUsers FROM users`;
  pool.query(sql, (err, data) => {
    res.send(result.createResult(err, data[0]));
  });
});


router.get('/total-books', (req, res) => {
  const sql = `SELECT COUNT(*) AS totalBooks FROM books WHERE is_active = 1`;
  pool.query(sql, (err, data) => {
    res.send(result.createResult(err, data[0]));
  });
});

// TOTAL REVENUE (LIFETIME)

router.get('/total-revenue', (req, res) => {
  const sql = `
    SELECT IFNULL(SUM(total_amount), 0) AS totalRevenue
    FROM orders
    WHERE LOWER(status) = 'delivered'
  `;
  pool.query(sql, (err, data) => {
    res.send(result.createResult(err, data[0]));
  });
});

module.exports = router
