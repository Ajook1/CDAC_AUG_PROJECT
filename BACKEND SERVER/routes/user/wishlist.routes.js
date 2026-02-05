const express = require("express");
const router = express.Router();
const pool = require("../../utils/db");
const result = require("../../utils/result");
const authorizeUser = require("../../auth/authUser");

/* ======================= GET WISHLIST (INVENTORY BASED) ======================= */
router.get("/", authorizeUser, (req, res) => {
  const sql = `
    SELECT 
      w.inventory_id,
      b.title,
      b.cover_image_url,
      IFNULL(a.name, 'Unknown Author') AS author,
      bi.price
    FROM wishlist w
    JOIN book_inventory bi ON w.inventory_id = bi.inventory_id
    JOIN books b ON bi.book_id = b.book_id
    LEFT JOIN authors a ON b.author_id = a.author_id
    WHERE w.user_id = ?
  `;

  pool.query(sql, [req.user.user_id], (err, data) => {
    if (err) return res.send(result.createResult(err));
    res.send(result.createResult(null, data));
  });
});

/* ======================= ADD TO WISHLIST ======================= */
router.post("/", authorizeUser, (req, res) => {
  const { inventory_id } = req.body;

  pool.query(
    "INSERT IGNORE INTO wishlist (user_id, inventory_id) VALUES (?, ?)",
    [req.user.user_id, inventory_id],
    err => {
      if (err) return res.send(result.createResult(err));
      res.send(result.createResult(null, "Added to wishlist"));
    }
  );
});

/* ======================= REMOVE FROM WISHLIST ======================= */
router.delete("/:inventory_id", authorizeUser, (req, res) => {
  pool.query(
    "DELETE FROM wishlist WHERE user_id=? AND inventory_id=?",
    [req.user.user_id, req.params.inventory_id],
    err => {
      if (err) return res.send(result.createResult(err));
      res.send(result.createResult(null, "Removed from wishlist"));
    }
  );
});

module.exports = router;
