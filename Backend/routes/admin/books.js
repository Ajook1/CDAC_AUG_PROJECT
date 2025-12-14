const express = require('express')
const multer = require('multer')
const fs = require('fs')

const pool = require('../utils/db')
const result = require('../utils/result')

const router = express.Router()

// Setup multer for image upload - ensure 'bookcovers' directory exists
const upload = multer({ dest: 'bookcovers' }) 


// GET all books with inventory details 

router.get('/', (req, res) => {
    const sql = `
        SELECT 
            b.book_id, b.title, b.description, b.isbn, b.cover_image_url, 
            b.pages, b.language, b.publication_date,
            a.name AS author_name, p.name AS publisher_name, c.category_name,
            GROUP_CONCAT(CONCAT(bi.store_id, ':', bi.stock_quantity) SEPARATOR ';') AS stock_details
        FROM books b
        JOIN authors a ON b.author_id = a.author_id
        JOIN publishers p ON b.publisher_id = p.publisher_id
        JOIN categories c ON b.category_id = c.category_id
        LEFT JOIN book_inventory bi ON b.book_id = bi.book_id
        GROUP BY b.book_id
        ORDER BY b.title`
        
    pool.query(sql, (err, data) => {
        res.send(result.createResult(err, data))
    })
})
