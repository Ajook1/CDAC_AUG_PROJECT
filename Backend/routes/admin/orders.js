const express = require('express')
const pool = require('../utils/db')
const result = require('../utils/result')

const router = express.Router()


// Get All Orders 

router.get('/', (req, res) => {
    const sql = `
        SELECT 
            o.order_id, o.user_id, o.order_date, o.total_amount, o.status,
            u.name AS username, u.email,
            p.payment_status, p.transaction_id
        FROM orders o
        JOIN users u ON o.user_id = u.user_id
        LEFT JOIN payments p ON o.order_id = p.order_id
        ORDER BY o.order_date DESC
    `
    pool.query(sql, (err, data) => {
        res.send(result.createResult(err, data))
    })
})