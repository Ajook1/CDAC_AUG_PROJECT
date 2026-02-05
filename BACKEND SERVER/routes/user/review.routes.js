const express = require("express");
const router = express.Router();
const pool = require("../../utils/db");
const result = require("../../utils/result");
const authorizeUser = require("../../auth/authUser");

/* ===================== ADD REVIEW ===================== */
router.post("/", authorizeUser, (req, res) => {
    const userId = req.user.user_id;
    const { book_id, rating, comment } = req.body;

    if (!book_id || !rating) {
        return res.send(
            result.createResult("book_id and rating are required")
        );
    }

    const sql = `
    INSERT INTO reviews (book_id, user_id, rating, comment)
    VALUES (?, ?, ?, ?)
  `;

    pool.query(
        sql,
        [book_id, userId, rating, comment || ""],
        (err, data) => {
            if (err) return res.send(result.createResult(err));

            res.send(
                result.createResult(null, {
                    message: "Review added successfully",
                    review_id: data.insertId
                })
            );
        }
    );
});

/* ===================== GET REVIEWS FOR BOOK ===================== */
router.get("/:book_id", (req, res) => {
    const sql = `
    SELECT r.review_id, r.rating, r.comment, r.review_date, u.name
    FROM reviews r
    JOIN users u ON r.user_id = u.user_id
    WHERE r.book_id = ?
    ORDER BY r.review_date DESC
  `;

    pool.query(sql, [req.params.book_id], (err, data) => {
        if (err) return res.send(result.createResult(err));
        res.send(result.createResult(null, data));
    });
});

/* ===================== DELETE REVIEW ===================== */
router.delete("/:review_id", authorizeUser, (req, res) => {
    const sql = `
    DELETE FROM reviews
    WHERE review_id = ? AND user_id = ?
  `;

    pool.query(
        sql,
        [req.params.review_id, req.user.user_id],
        (err, data) => {
            if (err) return res.send(result.createResult(err));
            if (data.affectedRows === 0)
                return res.send(
                    result.createResult("Review not found or not yours")
                );

            res.send(
                result.createResult(null, "Review deleted successfully")
            );
        }
    );
});

module.exports = router;
