const express = require('express');
const bcrypt = require('bcrypt');

const pool = require('../../utils/db');
const result = require('../../utils/result');

const router = express.Router();
const SaltRounds = 10;


/// ADMIN : GET ALL USERS

router.get('/', (req, res) => {
  const sql = `
    SELECT u.user_id, u.name, u.email, u.phone, u.is_active,
           u.role_id, r.role_name
    FROM users u
    JOIN roles r ON u.role_id = r.role_id
  `;
  pool.query(sql, (err, data) => {
    res.send(result.createResult(err, data));
  });
});


/// ADMIN : ADD NEW USER

router.post('/', (req, res) => {
  const { name, email, password, phone, role_id, is_active } = req.body;

  if (!name || !email || !password || !role_id) {
    return res.send(result.createResult("Required fields missing"));
  }

  const sql = `
    INSERT INTO users
    (name, email, password_hash, phone, role_id, is_active)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  bcrypt.hash(password, SaltRounds, (err, password_hash) => {
    if (err) {
      return res.send(result.createResult(err));
    }

    pool.query(
      sql,
      [
        name,
        email,
        password_hash,
        phone || null,
        role_id,
        is_active ?? 1
      ],
      (err, data) => {
        res.send(result.createResult(err, data));
      }
    );
  });
});


/// ADMIN : UPDATE USER DETAILS

router.put('/', (req, res) => {
  const { user_id, phone, role_id, is_active } = req.body;

  const sqlGet = `SELECT * FROM users WHERE user_id = ?`;

  pool.query(sqlGet, [user_id], (err, data) => {
    if (err) return res.send(result.createResult(err));
    if (data.length === 0)
      return res.send(result.createResult("User not found"));

    const oldUser = data[0];

    const finalPhone = phone ?? oldUser.phone;
    const finalRole = role_id ?? oldUser.role_id;
    const finalActive = is_active ?? oldUser.is_active;

    const sqlUpdate = `
      UPDATE users
      SET phone = ?, role_id = ?, is_active = ?
      WHERE user_id = ?
    `;

    pool.query(
      sqlUpdate,
      [finalPhone, finalRole, finalActive, user_id],
      (err, data) => {
        res.send(result.createResult(err, data));
      }
    );
  });
});


// ADMIN : CHANGE USER STATUS (ACTIVATE/DEACTIVATE)

router.put('/status', (req, res) => {
  const { user_id, is_active } = req.body;

  const sql = `
    UPDATE users
    SET is_active = ?
    WHERE user_id = ?
  `;

  pool.query(sql, [is_active, user_id], (err, data) => {
    res.send(result.createResult(err, data));
  });
});


// ADMIN : DELETE A USER

router.delete('/', (req, res) => {
  const { user_id } = req.body;
  const sql = `DELETE FROM users WHERE user_id = ?`;

  pool.query(sql, [user_id], (err, data) => {
    res.send(result.createResult(err, data));
  });
});


module.exports = router;
