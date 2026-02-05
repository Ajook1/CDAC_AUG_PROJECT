const express = require('express')
const pool = require('../../utils/db')
const result = require('../../utils/result')

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


// Add a New Category

router.post('/', (req, res) => {
    const { category_name, parent_id } = req.body
    const sql = `INSERT INTO categories(category_name, parent_id) VALUES (?, ?)`

    const finalParentId = (parent_id === 'null' || !parent_id) ? null : parent_id;

    pool.query(sql, [category_name, finalParentId], (err, data) => {
        res.send(result.createResult(err, data))
    })
})


// Update Category

router.put('/', (req, res) => {
    const { category_id, category_name, parent_id } = req.body
    const sql = `UPDATE categories SET category_name = ?, parent_id = ? WHERE category_id = ?`

    const finalParentId = (parent_id === 'null' || !parent_id) ? null : parent_id;

    pool.query(sql, [category_name, finalParentId, category_id], (err, data) => {
        res.send(result.createResult(err, data))
    })
})

//  Delete a category

router.delete('/', (req, res) => {
    const { category_id } = req.body
    const sql = `DELETE FROM categories WHERE category_id = ?`
    pool.query(sql, [category_id], (err, data) => {
        res.send(result.createResult(err, data))
    })
})

module.exports = router