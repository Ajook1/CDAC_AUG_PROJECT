const express = require("express");
const router = express.Router();
const pool = require("../../utils/db");
const result = require("../../utils/result");
const authorizeUser = require("../../auth/authUser");

/* ===================== INITIATE COD PAYMENT ===================== */
router.post("/cod", authorizeUser, (req, res) => {
    const userId = req.user.user_id;
    const { order_id } = req.body;

    if (!order_id) {
        return res.send(result.createResult("order_id is required"));
    }

    // 1️⃣ Verify order ownership
    const orderSql =
        "SELECT total_amount FROM orders WHERE order_id = ? AND user_id = ?";

    pool.query(orderSql, [order_id, userId], (err, orders) => {
        if (err) return res.send(result.createResult(err));
        if (orders.length === 0)
            return res.send(result.createResult("Order not found"));

        // 2️⃣ Insert payment
        const paymentSql = `
      INSERT INTO payments (order_id, payment_method, payment_status)
      VALUES (?, 'COD', 'Pending')
    `;

        pool.query(paymentSql, [order_id], (err2, payRes) => {
            if (err2) return res.send(result.createResult(err2));

            res.send(
                result.createResult(null, {
                    message: "COD payment initiated",
                    payment_id: payRes.insertId
                })
            );
        });
    });
});

/* ===================== PAYMENT STATUS ===================== */
router.get("/:order_id/status", authorizeUser, (req, res) => {
    const sql = `
    SELECT payment_id, payment_method, payment_status, payment_date
    FROM payments
    WHERE order_id = ?
  `;

    pool.query(sql, [req.params.order_id], (err, data) => {
        if (err) return res.send(result.createResult(err));
        if (data.length === 0)
            return res.send(result.createResult("Payment not found"));

        res.send(result.createResult(null, data[0]));
    });
});

module.exports = router;
