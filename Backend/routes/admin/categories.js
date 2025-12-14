const express = require('express')
const pool = require('../utils/db')
const result = require('../utils/result')

const router = express.Router()


// Get All Categories
 
router.get('/', (req, res) => {
    const sql = `
        SELECT c1.category_id, c1.category_name, 
               c2.category_name AS parent_category_name, c1.parent_id
        FROM categories c1
        LEFT JOIN categories c2 ON c1.parent_id = c2.category_id
        ORDER BY c1.category_name
    `
    pool.query(sql, (err, data) => {
        res.send(result.createResult(err, data))
    })
})