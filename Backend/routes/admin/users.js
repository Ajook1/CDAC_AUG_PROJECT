const express = require('express')
const bcrypt = require('bcrypt')

const pool = require('../utils/db')
const result = require('../utils/result')

const router = express.Router()
const SaltRounds = 10



// ADMIN : GET All Users

router.get('/', (req, res) => {
    const sql = `
        SELECT u.user_id, u.name, u.email, u.phone, u.is_active, r.role_name
        FROM users u
        JOIN roles r ON u.role_id = r.role_id`
        
    pool.query(sql, (err, data) => {
        res.send(result.createResult(err, data))
    })
})
