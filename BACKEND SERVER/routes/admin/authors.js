const express = require('express')
const pool = require('../../utils/db')
const result = require('../../utils/result')

const router = express.Router()


router.get('/', (req, res) => {
    const sql = `SELECT author_id, name, biography FROM authors ORDER BY name ASC`
    pool.query(sql, (err, data) => {
        res.send(result.createResult(err, data))
    })
})


router.post('/', (req, res) => {
    const { name, biography } = req.body
    if (!name) return res.send(result.createResult("Author name is required"))
    const sql = `INSERT INTO authors (name, biography) VALUES (?, ?)`
    pool.query(sql, [name, biography], (err, data) => {
        res.send(result.createResult(err, data))
    })
})


router.put('/', (req, res) => {
    const { author_id, name, biography } = req.body
    const sql = `UPDATE authors SET name = ?, biography = ? WHERE author_id = ?`
    pool.query(sql, [name, biography, author_id], (err, data) => {
        res.send(result.createResult(err, data))
    })
})


router.delete('/', (req, res) => {
    const { author_id } = req.body

    const checkSql = `SELECT * FROM books WHERE author_id = ?`

    pool.query(checkSql, [author_id], (err, data) => {
        if (err) return res.send(result.createResult(err))

        if (data.length > 0) {
            return res.send(result.createResult("Cannot delete: This author has books."))
        }

        const deleteSql = `DELETE FROM authors WHERE author_id = ?`
        pool.query(deleteSql, [author_id], (err, data) => {
            res.send(result.createResult(err, data))
        })
    })
})


module.exports = router