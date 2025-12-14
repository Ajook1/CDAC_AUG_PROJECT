
const express = require('express');
const pool = require('../utils/db');
const { createResult } = require('../utils/result');
const authOwner = require('../auth/authMiddleware');
const router = express.Router();


/*
   Add admin book OR owner-created book to inventory
*/
router.post('/owner/inventory', authOwner, (req, res) => {

    const {
        book_id,
        new_book,
        price,
        mrp,
        stock_quantity,
        sku
    } = req.body;

    // Step 1: get store_id for the owner
    const storeSql = 'SELECT store_id FROM bookstores WHERE owner_id = ?';

    pool.query(storeSql, [req.user.user_id], (err, storeRows) => {
        if (err) return res.send(createResult(err));
        if (!storeRows.length) return res.send(createResult('Store not found'));

        const store_id = storeRows[0].store_id;


        // CASE 1: Existing book (ADDED BY ADMIN)
        if (book_id) {
            return addToInventory(book_id);
        }

        // CASE 2: Owner adds his custom book
        if (new_book && new_book.title) {

            const {
                title,
                description,
                isbn,
                language
            } = new_book;

            const insertBookSql = `
                INSERT INTO books
                (title, description, isbn, language, added_by, owner_id)
                VALUES (?, ?, ?, ?, 'OWNER', ?)
            `;

            pool.query(
                insertBookSql,
                [
                    title,
                    description || null,
                    isbn || null,
                    language || null,
                    req.user.user_id
                ],
                (bookErr, bookResult) => {
                    if (bookErr) return res.send(createResult(bookErr));

                    addToInventory(bookResult.insertId);
                }
            );

            return;
        }

        return res.send(createResult('Either book_id or new_book is required'));

        // Helper: Add book to inventory
        function addToInventory(finalBookId) {

            const insertInventorySql = `
                INSERT INTO book_inventory
                (store_id, book_id, price, mrp, stock_quantity, sku)
                VALUES (?, ?, ?, ?, ?, ?)
            `;

            pool.query(
                insertInventorySql,
                [
                    store_id,
                    finalBookId,
                    price || 0,
                    mrp || null,
                    stock_quantity || 0,
                    sku || null
                ],
                (invErr, invResult) => {
                    if (invErr) return res.send(createResult(invErr));

                    res.send(
                        createResult(null, {
                            message: 'Book added to inventory',
                            inventory_id: invResult.insertId,
                            book_id: finalBookId
                        })
                    );
                }
            );
        }
    });
});



/* 
   show all the books in the inventory for the owner
*/
router.get('/owner/inventory', authOwner, (req, res) => {

    const sql = `
        SELECT
            bi.inventory_id,
            bi.book_id,
            bi.price,
            bi.mrp,
            bi.stock_quantity,
            bi.is_active,
            b.title,
            b.isbn
        FROM book_inventory bi
        JOIN books b ON bi.book_id = b.book_id
        JOIN bookstores s ON bi.store_id = s.store_id
        WHERE s.owner_id = ?
    `;

    pool.query(sql, [req.user.user_id], (err, rows) => {
        if (err) return res.send(createResult(err));
        res.send(createResult(null, rows));
    });
});


/* 
   fetch single book details from inventory for the owner
 */
router.get('/owner/inventory/:book_id', authOwner, (req, res) => {

    const { book_id } = req.params;

    const sql = `
        SELECT
            bi.*,
            b.title,
            b.description
        FROM book_inventory bi
        JOIN books b ON bi.book_id = b.book_id
        JOIN bookstores s ON bi.store_id = s.store_id
        WHERE s.owner_id = ? AND bi.book_id = ?
    `;

    pool.query(sql, [req.user.user_id, book_id], (err, rows) => {
        if (err) return res.send(createResult(err));
        res.send(createResult(null, rows[0] || null));
    });
});


/* 
   Update full inventory details of a book
 */
router.put('/owner/inventory/:book_id', authOwner, (req, res) => {

    const { book_id } = req.params;

    const sql = `
        UPDATE book_inventory bi
        JOIN bookstores s ON bi.store_id = s.store_id
        SET bi.price = ?, bi.mrp = ?, bi.stock_quantity = ?, bi.is_active = ?
        WHERE s.owner_id = ? AND bi.book_id = ?
    `;

    const {
        price,
        mrp,
        stock_quantity,
        is_active
    } = req.body;

    pool.query(
        sql,
        [
            price,
            mrp,
            stock_quantity,
            is_active,
            req.user.user_id,
            book_id
        ],
        (err) => {
            if (err) return res.send(createResult(err));

            res.send(
                createResult(null, {
                    message: 'Inventory updated successfully'
                })
            );
        }
    );
});


/* Remove book from inventory */
router.delete('/owner/inventory/:book_id', authOwner, (req, res) => {

    const { book_id } = req.params;

    const sql = `
        DELETE bi
        FROM book_inventory bi
        JOIN bookstores s ON bi.store_id = s.store_id
        WHERE s.owner_id = ? AND bi.book_id = ?
    `;

    pool.query(sql, [req.user.user_id, book_id], (err) => {
        if (err) return res.send(createResult(err));

        res.send(
            createResult(null, {
                message: 'Book removed from inventory'
            })
        );
    });
});

/* Update stock quantity only */
router.patch('/owner/inventory/:book_id/stock', authOwner, (req, res) => {

    const { stock_quantity } = req.body;
    const { book_id } = req.params;

    if (stock_quantity === undefined) {
        return res.send(createResult('stock_quantity is required'));
    }

    const sql = `
        UPDATE book_inventory bi
        JOIN bookstores s ON bi.store_id = s.store_id
        SET bi.stock_quantity = ?
        WHERE s.owner_id = ? AND bi.book_id = ?
    `;

    pool.query(
        sql,
        [stock_quantity, req.user.user_id, book_id],
        (err) => {
            if (err) return res.send(createResult(err));
            res.send(createResult(null, 'Stock updated successfully'));
        }
    );
});

/* Update price and MRP */
router.patch('/owner/inventory/:book_id/price', authOwner, (req, res) => {

    const { price, mrp } = req.body;
    const { book_id } = req.params;

    const sql = `
        UPDATE book_inventory bi
        JOIN bookstores s ON bi.store_id = s.store_id
        SET bi.price = ?, bi.mrp = ?
        WHERE s.owner_id = ? AND bi.book_id = ?
    `;

    pool.query(
        sql,
        [price, mrp, req.user.user_id, book_id],
        (err) => {
            if (err) return res.send(createResult(err));
            res.send(createResult(null, 'Price updated successfully'));
        }
    );
});

/* Activate or deactivate a book for sale */
router.patch('/owner/inventory/:book_id/status', authOwner, (req, res) => {

    const { is_active } = req.body;
    const { book_id } = req.params;

    const sql = `
        UPDATE book_inventory bi
        JOIN bookstores s ON bi.store_id = s.store_id
        SET bi.is_active = ?
        WHERE s.owner_id = ? AND bi.book_id = ?
    `;

    pool.query(
        sql,
        [is_active, req.user.user_id, book_id],
        (err) => {
            if (err) return res.send(createResult(err));
            res.send(createResult(null, 'Book status updated'));
        }
    );
});

/* Get books with low stock (threshold < 5) */
router.get('/owner/inventory/low-stock', authOwner, (req, res) => {

    const sql = `
        SELECT bi.book_id, b.title, bi.stock_quantity
        FROM book_inventory bi
        JOIN books b ON bi.book_id = b.book_id
        JOIN bookstores s ON bi.store_id = s.store_id
        WHERE s.owner_id = ? AND bi.stock_quantity < 5
    `;

    pool.query(sql, [req.user.user_id], (err, rows) => {
        if (err) return res.send(createResult(err));
        res.send(createResult(null, rows));
    });
});

/* Get top selling books for the store */
router.get('/owner/inventory/top-selling', authOwner, (req, res) => {

    const sql = `
        SELECT
            b.title,
            SUM(oi.quantity) AS total_sold
        FROM order_items oi
        JOIN book_inventory bi ON oi.inventory_id = bi.inventory_id
        JOIN books b ON bi.book_id = b.book_id
        JOIN bookstores s ON bi.store_id = s.store_id
        WHERE s.owner_id = ?
        GROUP BY bi.book_id
        ORDER BY total_sold DESC
        LIMIT 10
    `;

    pool.query(sql, [req.user.user_id], (err, rows) => {
        if (err) return res.send(createResult(err));
        res.send(createResult(null, rows));
    });
});

module.exports = router;
