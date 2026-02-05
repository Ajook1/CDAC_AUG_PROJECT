const express = require("express");
const router = express.Router();
const pool = require("../../utils/db");
const result = require("../../utils/result");

/* ======================= GET BOOKS (INVENTORY BASED) ======================= */
router.get("/", (req, res) => {
  const sql = `
    SELECT 
      bi.inventory_id,
      b.book_id,
      b.title,
      b.cover_image_url,
      a.name AS author,
      bs.store_name,
      bi.price
    FROM book_inventory bi
    JOIN books b ON bi.book_id = b.book_id
    LEFT JOIN authors a ON b.author_id = a.author_id
    JOIN bookstores bs ON bi.store_id = bs.store_id
    WHERE bi.is_active = 1
      AND b.is_active = 1
  `;

  pool.query(sql, (err, data) => {
    if (err) return res.send(result.createResult(err));
    res.send(result.createResult(null, data));
  });
});



/* ===================== SEARCH BOOKS ===================== */
router.get("/search", (req, res) => {
    const q = `%${(req.query.q || "").toLowerCase()}%`;

    const sql = `
    SELECT
      bi.inventory_id,
      bi.price,
      bi.stock_quantity,
      b.book_id,
      b.title,
      b.cover_image_url,
      a.name AS author,
      bs.store_name
    FROM book_inventory bi
    JOIN books b ON bi.book_id = b.book_id
    LEFT JOIN authors a ON b.author_id = a.author_id
    JOIN bookstores bs ON bi.store_id = bs.store_id
    WHERE bi.is_active = 1
      AND b.is_active = 1
      AND (
        LOWER(b.title) LIKE ?
        OR LOWER(a.name) LIKE ?
      )
  `;

    pool.query(sql, [q, q], (err, rows) => {
        if (err) {
            console.error("Search error:", err);
            return res.json(createResult("Search failed"));
        }
        return res.json(createResult(null, rows));
    });
});

/* ===================== BOOKS BY CATEGORY ===================== */
router.get("/category/:id", (req, res) => {
    const sql = `
    SELECT
      bi.inventory_id,
      bi.price,
      bi.stock_quantity,
      b.book_id,
      b.title,
      b.cover_image_url,
      a.name AS author,
      bs.store_name
    FROM book_inventory bi
    JOIN books b ON bi.book_id = b.book_id
    LEFT JOIN authors a ON b.author_id = a.author_id
    JOIN bookstores bs ON bi.store_id = bs.store_id
    WHERE bi.is_active = 1
      AND b.is_active = 1
      AND b.category_id = ?
  `;

    pool.query(sql, [req.params.id], (err, rows) => {
        if (err) {
            console.error("Category error:", err);
            return res.json(createResult("Failed to load category books"));
        }
        return res.json(createResult(null, rows));
    });
});

/* ===================== GET SINGLE BOOK (BY INVENTORY) ===================== */
router.get("/:inventoryId", (req, res) => {
    const sql = `
    SELECT
      bi.inventory_id,
      bi.price,
      bi.stock_quantity,
      b.book_id,
      b.title,
      b.description,
      b.cover_image_url,
      a.name AS author,
      bs.store_name
    FROM book_inventory bi
    JOIN books b ON bi.book_id = b.book_id
    LEFT JOIN authors a ON b.author_id = a.author_id
    JOIN bookstores bs ON bi.store_id = bs.store_id
    WHERE bi.inventory_id = ?
      AND bi.is_active = 1
  `;

    pool.query(sql, [req.params.inventoryId], (err, rows) => {
        if (err) {
            console.error("Single book error:", err);
            return res.json(createResult("Failed to load book"));
        }

        if (!rows.length) {
            return res.json(createResult("Book not found"));
        }

        return res.json(createResult(null, rows[0]));
    });
});

module.exports = router;
