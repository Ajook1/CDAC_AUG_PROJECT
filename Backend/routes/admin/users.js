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


// ADMIN : Add New User/admin

router.post('/', (req, res) => {
    const { name, email, password, phone, role_id } = req.body
    const sql = `INSERT INTO users(name, email, password_hash, phone, role_id, is_active) VALUES (?,?,?,?,? , 1)`
    
    bcrypt.hash(password, SaltRounds, (err, password_hash) => {
        if (password_hash) {
            pool.query(sql, [name, email, password_hash, phone, role_id], (err, data) => {
                res.send(result.createResult(err, data))
            })
        } else {
            res.send(result.createResult(err))
        }
    })
})
