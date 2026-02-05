const express = require('express')
const pool = require('../../utils/db')
const result = require('../../utils/result')

const router = express.Router()

// CREATE BOOKSTORE 

router.post('/', (req, res) => {
  const {
    owner_id,
    store_name,
    description,
    address_line,
    city,
    state,
    postal_code,
    country,
    contact_email,
    contact_phone
  } = req.body

  const sql = `
    INSERT INTO bookstores
    (owner_id, store_name, description, address_line, city, state,
     postal_code, country, contact_email, contact_phone)
    VALUES (?,?,?,?,?,?,?,?,?,?)
  `

  pool.query(sql, [
    owner_id,
    store_name,
    description,
    address_line,
    city,
    state,
    postal_code,
    country,
    contact_email,
    contact_phone
  ], (err, data) => res.send(result.createResult(err, data)))
})

// GET ACTIVE BOOKSTORES

router.get('/', (req, res) => {
  pool.query(
    'SELECT * FROM bookstores WHERE is_active = 1',
    (err, data) => res.send(result.createResult(err, data))
  )
})

// GET ALL BOOKSTORES (ADMIN) 

router.get('/all', (req, res) => {
  pool.query(
    'SELECT * FROM bookstores',
    (err, data) => res.send(result.createResult(err, data))
  )
})


// DISABLE BOOKSTORE

router.put('/disable', (req, res) => {
  pool.query(
    'UPDATE bookstores SET is_active = 0 WHERE store_id = ?',
    [req.body.store_id],
    (err, data) => res.send(result.createResult(err, data))
  )
})

// ENABLE BOOKSTORE

router.put('/enable', (req, res) => {
  pool.query(
    'UPDATE bookstores SET is_active = 1 WHERE store_id = ?',
    [req.body.store_id],
    (err, data) => res.send(result.createResult(err, data))
  )
})

module.exports = router
