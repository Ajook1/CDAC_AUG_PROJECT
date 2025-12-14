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



// ADMIN : Update User 

router.put('/', (req, res) => {
    const { user_id, phone, role_id, is_active } = req.body

    // Step 1: Get OLD data First
    const sqlGet = `SELECT * FROM users WHERE user_id = ?`
    
    pool.query(sqlGet, [user_id], (err, data) => {
        if (err) return res.send(result.createResult(err))
        
        const oldUser = data[0] 

       
        const finalPhone  = (phone !== undefined) ? phone : oldUser.phone
        const finalRole   = (role_id !== undefined) ? role_id : oldUser.role_id        
        const finalActive = (is_active !== undefined) ? is_active : oldUser.is_active

        //  Update Everything with  final values
        const sqlUpdate = `UPDATE users SET phone = ?, role_id = ?, is_active = ? WHERE user_id = ?`
        
        pool.query(sqlUpdate, [finalPhone, finalRole, finalActive, user_id], (err, data) => {
            res.send(result.createResult(err, data))
        })
    })
})

