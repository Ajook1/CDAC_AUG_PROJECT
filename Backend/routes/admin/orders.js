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


// GET Order Details (By Order_Id)

router.get('/:order_id', (req, res) => {
    const order_id = req.params.order_id
    const sql = `
        SELECT 
            oi.order_item_id, oi.quantity, oi.price AS item_price,
            b.title AS book_title, a.name AS author_name
        FROM order_items oi
        JOIN book_inventory bi ON oi.inventory_id = bi.inventory_id
        JOIN books b ON bi.book_id = b.book_id
        JOIN authors a ON b.author_id = a.author_id
        WHERE oi.order_id = ?
    `
    pool.query(sql, [order_id], (err, data) => {
        res.send(result.createResult(err, data))
    })
})

