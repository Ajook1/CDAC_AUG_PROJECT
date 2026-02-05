
const express = require('express');

const pool = require('../../utils/db');


const { createResult } = require('../../utils/result');

const authOwner = require('../../auth/authMiddleware');

// Create router
const router = express.Router();
const upload = require('../../auth/upload'); // ✅ already exists in your project


/* 
   List all books available in owner's store inventory
    */
router.get('/', authOwner, (req, res) => {
    const sql = `
        SELECT
            bi.inventory_id,
            bi.store_id,
            s.store_name,
            bi.book_id,
            bi.price,
            bi.mrp,
            bi.stock_quantity,
            bi.is_active,
            b.title,
            b.isbn,
            b.cover_image_url
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
  
   Add admin book OR owner-created book to inventory
    */
router.post(
    '/',
    authOwner,
    upload.single('cover_image'),
    (req, res) => {

        console.log('REQ BODY:', req.body);
        console.log('REQ FILE:', req.file);

        const {
            store_id,
            book_id,
            price,
            mrp,
            stock_quantity,
            sku
        } = req.body;

        // ✅ Validate store
        if (!store_id) {
            return res.send(createResult('store_id is required'));
        }

        const validateStoreSql = `
            SELECT store_id
            FROM bookstores
            WHERE store_id = ? AND owner_id = ?
        `;

        pool.query(
            validateStoreSql,
            [store_id, req.user.user_id],
            (err, storeRows) => {
                if (err) return res.send(createResult(err));
                if (!storeRows.length) {
                    return res.send(createResult('Invalid store'));
                }

                /* ================= ADMIN BOOK ================= */
                if (book_id) {
                    return addToInventory(book_id);
                }

                /* ================= CUSTOM BOOK ================= */
                if (req.body.new_book) {

                    const {
                        title,
                        isbn,
                        language,
                        description
                    } = req.body.new_book;

                    if (!title) {
                        return res.send(createResult('Book title is required'));
                    }
                    const insertBookSql = `
    INSERT INTO books (
        title,
        isbn,
        language,
        description,
        cover_image_url,
        added_by,
        owner_id
    ) VALUES (?, ?, ?, ?, ?, 'OWNER', ?)
`;

                    pool.query(
                        insertBookSql,
                        [
                            title,
                            isbn || null,
                            language || null,
                            description || null,
                            req.file ? `uploads/${req.file.filename}` : null,
                            req.user.user_id
                        ],
                        (bookErr, bookResult) => {
                            if (bookErr) {
                                console.error('BOOK INSERT ERROR:', bookErr);
                                return res.send(createResult(bookErr));
                            }

                            addToInventory(bookResult.insertId);
                        }
                    );




                    return;
                }

                return res.send(createResult('Either book_id or new_book is required'));

                /* ================= INVENTORY INSERT ================= */
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
                            if (invErr) {
                                console.error('INVENTORY INSERT ERROR:', invErr);
                                return res.send(createResult(invErr));
                            }

                            res.send(
                                createResult(null, {
                                    message: 'Book added to inventory',
                                    inventory_id: invResult.insertId
                                })
                            );
                        }
                    );
                }
            }
        );
    }
);


// GET admin books (used only inside AddInventory flow)
router.get('/books/admin', authOwner, (req, res) => {
    const sql = `
        SELECT book_id, title, cover_image_url
        FROM books
        WHERE added_by = 'ADMIN'
    `;
    pool.query(sql, (err, rows) => {
        if (err) return res.send(createResult(err));
        res.send(createResult(null, rows));
    });
});




// router.put('/owner/inventory/:book_id', authOwner, (req, res) => {

//     const { book_id } = req.params;

//     const sql = `
//         UPDATE book_inventory bi
//         JOIN bookstores s ON bi.store_id = s.store_id
//         SET bi.price = ?, bi.mrp = ?, bi.stock_quantity = ?, bi.is_active = ?
//         WHERE s.owner_id = ? AND bi.book_id = ?
//     `;

//     const {
//         price,
//         mrp,
//         stock_quantity,
//         is_active
//     } = req.body;

//     pool.query(
//         sql,
//         [
//             price,
//             mrp,
//             stock_quantity,
//             is_active,
//             req.user.user_id,
//             book_id
//         ],
//         (err) => {
//             if (err) return res.send(createResult(err));

//             res.send(
//                 createResult(null, {
//                     message: 'Inventory updated successfully'
//                 })
//             );
//         }
//     );
// });

router.delete('/:inventory_id', authOwner, (req, res) => {

    const { inventory_id } = req.params;

    const sql = `
        DELETE bi
        FROM book_inventory bi
        JOIN bookstores s ON bi.store_id = s.store_id
        WHERE bi.inventory_id = ? AND s.owner_id = ?
    `;

    console.log('DELETE inventory_id:', inventory_id);

    pool.query(sql, [inventory_id, req.user.user_id], (err) => {
        if (err) return res.send(createResult(err));
        res.send(createResult(null, 'Book removed from inventory'));
    });
});



// router.patch('/owner/inventory/:book_id/stock', authOwner, (req, res) => {

//     const { stock_quantity } = req.body;
//     const { book_id } = req.params;

//     if (stock_quantity === undefined) {
//         return res.send(createResult('stock_quantity is required'));
//     }

//     const sql = `
//         UPDATE book_inventory bi
//         JOIN bookstores s ON bi.store_id = s.store_id
//         SET bi.stock_quantity = ?
//         WHERE s.owner_id = ? AND bi.book_id = ?
//     `;

//     pool.query(
//         sql,
//         [stock_quantity, req.user.user_id, book_id],
//         (err) => {
//             if (err) return res.send(createResult(err));
//             res.send(createResult(null, 'Stock updated successfully'));
//         }
//     );
// });


// router.patch('/owner/inventory/:book_id/price', authOwner, (req, res) => {

//     const { price, mrp } = req.body;
//     const { book_id } = req.params;

//     const sql = `
//         UPDATE book_inventory bi
//         JOIN bookstores s ON bi.store_id = s.store_id
//         SET bi.price = ?, bi.mrp = ?
//         WHERE s.owner_id = ? AND bi.book_id = ?
//     `;

//     pool.query(
//         sql,
//         [price, mrp, req.user.user_id, book_id],
//         (err) => {
//             if (err) return res.send(createResult(err));
//             res.send(createResult(null, 'Price updated successfully'));
//         }
//     );
// });


// ✅ UPDATE inventory (price + stock) BY inventory_id
router.patch(
    '/:inventory_id/update',
    authOwner,
    (req, res) => {
        const { inventory_id } = req.params;
        const { price, mrp, stock_quantity } = req.body;

        if (price === undefined || stock_quantity === undefined) {
            return res.send(createResult('price and stock_quantity are required'));
        }

        const sql = `
            UPDATE book_inventory bi
            JOIN bookstores s ON bi.store_id = s.store_id
            SET
                bi.price = ?,
                bi.mrp = ?,
                bi.stock_quantity = ?
            WHERE
                bi.inventory_id = ?
                AND s.owner_id = ?
        `;

        pool.query(
            sql,
            [
                price,
                mrp || null,
                stock_quantity,
                inventory_id,
                req.user.user_id
            ],
            (err, result) => {
                if (err) return res.send(createResult(err));

                if (!result.affectedRows) {
                    return res.send(createResult('Inventory item not found'));
                }

                res.send(createResult(null, 'Inventory updated successfully'));
            }
        );
    }
);



router.patch('/:inventory_id/status', authOwner, (req, res) => {

    const { is_active } = req.body;
    const { inventory_id } = req.params;

    const sql = `
        UPDATE book_inventory bi
        JOIN bookstores s ON bi.store_id = s.store_id
        SET bi.is_active = ?
        WHERE bi.inventory_id = ? AND s.owner_id = ?
    `;

    pool.query(sql, [is_active, inventory_id, req.user.user_id], (err) => {
        if (err) return res.send(createResult(err));
        res.send(createResult(null, 'Book status updated'));
    });
});



router.get('/low-stock', authOwner, (req, res) => {

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

router.get('/top-selling', authOwner, (req, res) => {

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
