const express = require("express");
const router = express.Router();
const pool = require("../../utils/db");
const { createResult } = require("../../utils/result");
const authUser = require("../../auth/authUser");

/* ===================== GET ALL ADDRESSES ===================== */
router.get("/", authUser, (req, res) => {
    const sql = "SELECT * FROM addresses WHERE user_id = ?";

    pool.query(sql, [req.user.user_id], (err, data) => {
        if (err) return res.send(createResult(err));
        res.send(createResult(null, data));
    });
});

/* ===================== ADD ADDRESS ===================== */
router.post("/", authUser, (req, res) => {
    const {
        full_name,
        address_line,
        city,
        state,
        postal_code,
        country,
        phone
    } = req.body;

    const sql = `
    INSERT INTO addresses
    (user_id, full_name, address_line, city, state, postal_code, country, phone)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

    pool.query(
        sql,
        [
            req.user.user_id,
            full_name,
            address_line,
            city,
            state,
            postal_code,
            country,
            phone
        ],
        (err, data) => {
            if (err) return res.send(createResult(err));
            res.send(createResult(null, { address_id: data.insertId }));
        }
    );
});

/* ===================== UPDATE ADDRESS ===================== */
router.put("/:id", authUser, (req, res) => {
    const {
        full_name,
        address_line,
        city,
        state,
        postal_code,
        country,
        phone
    } = req.body;

    const sql = `
    UPDATE addresses
    SET full_name=?, address_line=?, city=?, state=?, postal_code=?, country=?, phone=?
    WHERE address_id=? AND user_id=?
  `;

    pool.query(
        sql,
        [
            full_name,
            address_line,
            city,
            state,
            postal_code,
            country,
            phone,
            req.params.id,
            req.user.user_id
        ],
        (err, data) => {
            if (err) return res.send(createResult(err));
            if (data.affectedRows === 0) {
                return res.send(createResult("Address not found"));
            }

            res.send(createResult(null, "Address updated successfully"));
        }
    );
});

/* ===================== DELETE ADDRESS ===================== */
router.delete("/:id", authUser, (req, res) => {
    const sql = "DELETE FROM addresses WHERE address_id=? AND user_id=?";

    pool.query(
        sql,
        [req.params.id, req.user.user_id],
        (err, data) => {
            if (err) return res.send(createResult(err));
            if (data.affectedRows === 0) {
                return res.send(createResult("Address not found"));
            }

            res.send(createResult(null, "Address deleted successfully"));
        }
    );
});

module.exports = router;
