const express = require("express");
const router = express.Router();
const pool = require("../../utils/db");
const result = require("../../utils/result");
const authorizeUser = require("../../auth/authUser");

/* ===================== PLACE ORDER ===================== */
router.post("/", authorizeUser, async (req, res) => {
  const connection = await pool.promise().getConnection();
  try {
    const userId = req.user.user_id;
    const { address_id } = req.body;

    if (!address_id) {
      return res.send(result.createResult("address_id is required"));
    }

    await connection.beginTransaction();

    // 1️⃣ Get cart items with stock (LOCK rows)
    const [items] = await connection.query(
      `
      SELECT ci.inventory_id, ci.quantity, bi.price, bi.stock_quantity
      FROM cart c
      JOIN cart_items ci ON c.cart_id = ci.cart_id
      JOIN book_inventory bi ON ci.inventory_id = bi.inventory_id
      WHERE c.user_id = ?
      FOR UPDATE
      `,
      [userId]
    );

    if (items.length === 0) {
      throw new Error("Cart is empty");
    }

    // 2️⃣ Check stock for all items
    for (const item of items) {
      if (item.quantity > item.stock_quantity) {
        throw new Error("Some items are out of stock");
      }
    }

    // 3️⃣ Create order
    const [orderRes] = await connection.query(
      "INSERT INTO orders (user_id, address_id, total_amount) VALUES (?, ?, 0)",
      [userId, address_id]
    );

    const orderId = orderRes.insertId;
    let total = 0;

    // 4️⃣ Insert order items + deduct stock
    for (const item of items) {
      total += item.quantity * item.price;

      await connection.query(
        `INSERT INTO order_items 
         (order_id, inventory_id, quantity, price)
         VALUES (?, ?, ?, ?)`,
        [orderId, item.inventory_id, item.quantity, item.price]
      );

      await connection.query(
        `UPDATE book_inventory
         SET stock_quantity = stock_quantity - ?
         WHERE inventory_id = ?`,
        [item.quantity, item.inventory_id]
      );
    }

    // 5️⃣ Update total amount
    await connection.query(
      "UPDATE orders SET total_amount = ? WHERE order_id = ?",
      [total, orderId]
    );

    // 6️⃣ Clear cart
    await connection.query(
      "DELETE FROM cart_items WHERE cart_id = (SELECT cart_id FROM cart WHERE user_id = ?)",
      [userId]
    );

    await connection.commit();

    res.send(
      result.createResult(null, {
        message: "Order placed successfully",
        order_id: orderId,
        total_amount: total,
      })
    );
  } catch (err) {
    await connection.rollback();
    res.send(result.createResult(err.message));
  } finally {
    connection.release();
  }
});


/* ===================== GET USER ORDERS ===================== */
router.get("/", authorizeUser, (req, res) => {
    const sql =
        "SELECT * FROM orders WHERE user_id = ? ORDER BY order_date DESC";

    pool.query(sql, [req.user.user_id], (err, data) => {
        if (err) return res.send(result.createResult(err));
        res.send(result.createResult(null, data));
    });
});

/* ===================== GET ORDER DETAILS ===================== */
router.get("/:order_id", authorizeUser, (req, res) => {
    const sql = `
    SELECT 
      o.order_id, o.total_amount, o.status, o.order_date,
      b.title, oi.quantity, oi.price
    FROM orders o
    JOIN order_items oi ON o.order_id = oi.order_id
    JOIN book_inventory bi ON oi.inventory_id = bi.inventory_id
    JOIN books b ON bi.book_id = b.book_id
    WHERE o.order_id = ? AND o.user_id = ?
  `;

    pool.query(
        sql,
        [req.params.order_id, req.user.user_id],
        (err, data) => {
            if (err) return res.send(result.createResult(err));
            if (data.length === 0)
                return res.send(result.createResult("Order not found"));

            res.send(result.createResult(null, data));
        }
    );
});

/* ===================== CANCEL ORDER ===================== */
router.patch("/:order_id/cancel", authorizeUser, (req, res) => {
    const sql = `
    UPDATE orders
    SET status = 'Cancelled'
    WHERE order_id = ? AND user_id = ?
  `;

    pool.query(
        sql,
        [req.params.order_id, req.user.user_id],
        (err, data) => {
            if (err) return res.send(result.createResult(err));
            if (data.affectedRows === 0)
                return res.send(result.createResult("Order not found"));

            res.send(result.createResult(null, "Order cancelled successfully"));
        }
    );
});

module.exports = router;
