const express = require("express");
const router = express.Router();
const pool = require("../../utils/db");
const result = require("../../utils/result");
const authorizeUser = require("../../auth/authUser");


// ======================= GET CART =======================
router.get("/", authorizeUser, (req, res) => {
  const sql = `
    SELECT 
      ci.cart_item_id,
      b.title,
      ci.quantity,
      ci.price_at_addition,
      (ci.quantity * ci.price_at_addition) AS total_price
    FROM cart c
    JOIN cart_items ci ON c.cart_id = ci.cart_id
    JOIN book_inventory bi ON ci.inventory_id = bi.inventory_id
    JOIN books b ON bi.book_id = b.book_id
    WHERE c.user_id = ?
  `;

  pool.query(sql, [req.user.user_id], (err, data) => {
    if (err) return res.send(result.createResult(err));
    res.send(result.createResult(null, data));
  });
});


// ======================= ADD TO CART (WITH STOCK CHECK) =======================
router.post("/", authorizeUser, (req, res) => {
  const { inventory_id, quantity } = req.body;
  const userId = req.user.user_id;

  const getCartSql = "SELECT cart_id FROM cart WHERE user_id = ?";

  pool.query(getCartSql, [userId], (err, cartData) => {
    if (err) return res.send(result.createResult(err));

    const addItemToCart = (cartId) => {
      const insertItemSql = `
        INSERT INTO cart_items (cart_id, inventory_id, quantity, price_at_addition)
        VALUES (?, ?, ?, (SELECT price FROM book_inventory WHERE inventory_id=?))
        ON DUPLICATE KEY UPDATE 
        quantity = CASE
          WHEN (
            (SELECT stock_quantity FROM book_inventory WHERE inventory_id=?)
            >= cart_items.quantity + VALUES(quantity)
          )
          THEN cart_items.quantity + VALUES(quantity)
          ELSE cart_items.quantity
        END;
      `;

      pool.query(
        insertItemSql,
        [
          cartId,
          inventory_id,
          quantity,
          inventory_id,
          inventory_id  // for stock check
        ],
        (err2, data) => {
          if (err2) return res.send(result.createResult(err2));

          // If quantity did not increase → stock limit reached
          if (data.affectedRows === 0) {
            return res.send(result.createResult("Stock limit reached"));
          }

          res.send(result.createResult(null, "Item added to cart"));
        }
      );
    };

    // If cart exists
    if (cartData.length > 0) {
      addItemToCart(cartData[0].cart_id);
    } 
    // If cart doesn't exist
    else {
      pool.query(
        "INSERT INTO cart (user_id) VALUES (?)",
        [userId],
        (err3, newCart) => {
          if (err3) return res.send(result.createResult(err3));
          addItemToCart(newCart.insertId);
        }
      );
    }
  });
});


// ======================= UPDATE QUANTITY =======================
router.put("/:cart_item_id", authorizeUser, (req, res) => {
  const { quantity } = req.body;
  const cartItemId = req.params.cart_item_id;

  const sql = `
    UPDATE cart_items ci
    JOIN book_inventory bi ON ci.inventory_id = bi.inventory_id
    SET ci.quantity = ?
    WHERE ci.cart_item_id = ?
      AND ? <= bi.stock_quantity
  `;

  pool.query(sql, [quantity, cartItemId, quantity], (err, data) => {
    if (err) return res.send(result.createResult(err));

    if (data.affectedRows === 0) {
      return res.send(result.createResult("Stock limit reached"));
    }

    res.send(result.createResult(null, "Cart updated"));
  });
});



// ======================= DELETE ITEM =======================
router.delete("/:cart_item_id", authorizeUser, (req, res) => {
  const sql = "DELETE FROM cart_items WHERE cart_item_id = ?";

  pool.query(sql, [req.params.cart_item_id], (err, data) => {
    if (err) return res.send(result.createResult(err));
    if (data.affectedRows === 0)
      return res.send(result.createResult("Cart item not found"));

    res.send(result.createResult(null, "Item removed"));
  });
});

module.exports = router;
