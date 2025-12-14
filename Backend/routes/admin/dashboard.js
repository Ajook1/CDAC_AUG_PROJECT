const express = require('express')
const pool = require('../utils/db')
const result = require('../utils/result')

const router = express.Router()

router.get('/', async (req, res) => {
    try {

        const promisePool = pool.promise()

        // 1. Get Total Users
        const [userRows] = await promisePool.query(`SELECT COUNT(user_id) AS total FROM users`)
        const totalUsers = userRows[0].total

        
        // 2. Get Total Books
        const [bookRows] = await promisePool.query(`SELECT COUNT(book_id) AS total FROM books`)
        const totalBooks = bookRows[0].total


        // 3. Get Total Orders
        const [orderRows] = await promisePool.query(`SELECT COUNT(order_id) AS total FROM orders`)
        const totalOrders = orderRows[0].total


        // 4. Get Total Revenue ( 'Delivered' orders only)
        const [revenueRows] = await promisePool.query(`SELECT SUM(total_amount) AS total FROM orders WHERE status = 'Delivered'`)
        // Revenue is Nulll set it to 0
        const totalRevenue = revenueRows[0].total || 0


        const dashboardData = {
            total_users: totalUsers,
            total_books: totalBooks,
            total_orders: totalOrders,
            total_revenue: totalRevenue
        }

        res.send(result.createResult(null, dashboardData))

    } catch (error) {
        res.send(result.createResult(error.message))
    }
})

module.exports = router