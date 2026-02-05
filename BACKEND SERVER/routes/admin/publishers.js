const express = require('express')
const pool = require('../../utils/db')
const result = require('../../utils/result')

const router = express.Router()


router.get('/', (req, res) => {
    const sql = `SELECT publisher_id, name, contact_info FROM publishers ORDER BY name ASC`
    pool.query(sql, (err, data) => {
        res.send(result.createResult(err, data))
    })
})


router.post('/', (req, res) => {
    const { name, contact_info } = req.body
    if (!name) return res.send(result.createResult("Publisher name is required"))
    const sql = `INSERT INTO publishers (name, contact_info) VALUES (?, ?)`
    pool.query(sql, [name, contact_info], (err, data) => {
        res.send(result.createResult(err, data))
    })
})


router.put('/', (req, res) => {
    const { publisher_id, name, contact_info } = req.body
    const sql = `UPDATE publishers SET name = ?, contact_info = ? WHERE publisher_id = ?`
    pool.query(sql, [name, contact_info, publisher_id], (err, data) => {
        res.send(result.createResult(err, data))
    })
})


router.delete('/', (req, res) => {
    const { publisher_id } = req.body

    if (!publisher_id) {
        return res.send(result.createResult("Publisher ID is required"))
    }

    // 1. Check if publisher has books
    const checkSql = `SELECT * FROM books WHERE publisher_id = ?`

    pool.query(checkSql, [publisher_id], (err, data) => {
        if (err) {
            return res.send(result.createResult(err))
        }

        if (data.length > 0) {
            return res.send(
                result.createResult("Cannot delete: This publisher has associated books.")
            )
        }

        // 2. Delete publisher
        const deleteSql = `DELETE FROM publishers WHERE publisher_id = ?`

        pool.query(deleteSql, [publisher_id], (err, data) => {
            res.send(result.createResult(err, data))
        })
    })
})


module.exports = router