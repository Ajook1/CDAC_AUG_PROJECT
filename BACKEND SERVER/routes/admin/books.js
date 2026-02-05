const express = require('express')
const multer = require('multer')
const fs = require('fs')

const { createResult } = require('../../utils/result');


const pool = require('../../utils/db')
const result = require('../../utils/result')

const router = express.Router()
const upload = multer({ dest: 'uploads' })


// Get Actice Books for Admin Dashboard

router.get('/', (req, res) => {
  const sql = `
    SELECT 
      b.book_id, b.title, b.description, b.isbn, b.cover_image_url,
      b.pages, b.language, b.publication_date, b.is_active,
      a.name AS author_name,
      p.name AS publisher_name,
      c.category_name,
      MIN(bi.price) AS price,
      MIN(bi.mrp) AS mrp,
      GROUP_CONCAT(
        CONCAT('Store ', bi.store_id, ' → Stock:', bi.stock_quantity)
        SEPARATOR ' | '
      ) AS stock_details
    FROM books b
    JOIN authors a ON b.author_id = a.author_id
    JOIN publishers p ON b.publisher_id = p.publisher_id
    JOIN categories c ON b.category_id = c.category_id
    LEFT JOIN book_inventory bi ON b.book_id = bi.book_id
    WHERE b.is_active = 1
    GROUP BY b.book_id, a.name, p.name, c.category_name
    ORDER BY b.title
  `
  pool.query(sql, (err, data) =>
    res.send(result.createResult(err, data))
  )
})

// ✅ GET STORES FOR DROPDOWN
router.get('/stores', (req, res) => {
  pool.query(
    'SELECT store_id, store_name FROM bookstores WHERE is_active = 1',
    (err, rows) => res.send(createResult(err, rows))
  );
});




//   GET ALL BOOKS (ADMIN) + FILTERS

router.get('/all', (req, res) => {
  const { category, status } = req.query

  let whereClause = 'WHERE 1=1'
  let params = []

  if (category) {
    whereClause += ' AND LOWER(c.category_name) LIKE ?'
    params.push(`%${category.toLowerCase()}%`)
  }

  if (status === 'active') whereClause += ' AND b.is_active = 1'
  if (status === 'disabled') whereClause += ' AND b.is_active = 0'

  const sql = `
SELECT
  b.book_id,
  b.title,
  b.description,
  b.isbn,
  b.cover_image_url,
  b.pages,
  b.language,
  b.publication_date,
  b.is_active,
  b.added_by,

  a.name AS author_name,
  p.name AS publisher_name,
  c.category_name,

  bi.inventory_id,
  bi.price,
  bi.mrp,
  bi.stock_quantity,

  CONCAT(
    'Store ', bs.store_name,
    ' → Stock: ', bi.stock_quantity
  ) AS stock_details

FROM books b

LEFT JOIN authors a ON b.author_id = a.author_id
LEFT JOIN publishers p ON b.publisher_id = p.publisher_id
LEFT JOIN categories c ON b.category_id = c.category_id

JOIN book_inventory bi ON b.book_id = bi.book_id
JOIN bookstores bs ON bi.store_id = bs.store_id

${whereClause}

ORDER BY b.title
`;


  pool.query(sql, params, (err, data) => {
    if (err) return res.send(result.createResult(err))
    res.send(result.createResult(null, data))
  })
})

// ADD NEW BOOK
router.post('/', upload.single('cover'), (req, res) => {
  const {
    title, description, isbn, author_id, publisher_id, category_id,
    language, pages, publication_date,
    store_id, price, mrp, stock_quantity
  } = req.body;

  if (!store_id) {
    return res.send(createResult('store_id is required'));
  }

  const cover_image_url = `uploads/${req.file.filename}`;

  const sqlBook = `
    INSERT INTO books
    (title, description, isbn, author_id, publisher_id,
     category_id, language, pages, publication_date, cover_image_url, added_by)
    VALUES (?,?,?,?,?,?,?,?,?,?, 'ADMIN')
  `;

  pool.query(sqlBook, [
    title, description, isbn, author_id, publisher_id,
    category_id, language, pages, publication_date, cover_image_url
  ], (err, bookData) => {
    if (err) return res.send(createResult(err));

    const sqlInv = `
      INSERT INTO book_inventory
      (book_id, store_id, price, mrp, stock_quantity, is_active)
      VALUES (?, ?, ?, ?, ?, 1)
    `;

    pool.query(sqlInv, [
      bookData.insertId,
      store_id,
      price,
      mrp,
      stock_quantity
    ], (err2, data) =>
      res.send(createResult(err2, data))
    );
  });
});



// UPDATE INVENTORY

// ✅ UPDATE INVENTORY (ADMIN)
router.put('/update-inventory', (req, res) => {
  const { inventory_id, price, mrp, stock_quantity } = req.body;

  const sql = `
    UPDATE book_inventory
    SET price = ?, mrp = ?, stock_quantity = ?
    WHERE inventory_id = ?
  `;

  pool.query(sql, [price, mrp, stock_quantity, inventory_id], (err) => {
    res.send(createResult(err, "Inventory updated successfully"));
  });
});



//  DISABLE BOOK

router.put('/disable', (req, res) => {
  pool.query(
    'UPDATE books SET is_active=0 WHERE book_id=?',
    [req.body.book_id],
    (err, data) => res.send(result.createResult(err, data))
  )
})

//  ENABLE BOOK

router.put('/enable', (req, res) => {
  pool.query(
    'UPDATE books SET is_active=1 WHERE book_id=?',
    [req.body.book_id],
    (err, data) => res.send(result.createResult(err, data))
  )
})

module.exports = router
