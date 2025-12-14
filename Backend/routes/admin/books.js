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


// Add a new book 

router.post('/', upload.single('cover'), (req, res) => {
    const { 
        title, description, isbn, author_id, publisher_id, category_id, 
        language, pages, publication_date, store_id, price, mrp, stock_quantity 
    } = req.body
    
    if (!req.file) {
        return res.send(result.createResult('Book cover image is required'))
    }

    const fileExtension = '.jpg' 
    const cover_image_url = req.file.filename + fileExtension
    const oldPath = req.file.path
    const newPath = oldPath + fileExtension

    // 1. Rename the uploaded file
    fs.rename(oldPath, newPath, (err) => {
        if (err) {
            console.error('File rename error:', err);
            return res.send(result.createResult('Error renaming file'))
        }


        // 2. Insert into the books table
        const sqlBook = `
            INSERT INTO books(title, description, isbn, author_id, publisher_id, category_id, language, pages, publication_date, cover_image_url) 
            VALUES (?,?,?,?,?,?,?,?,?,?)`
        
        pool.query(sqlBook, [title, description, isbn, author_id, publisher_id, category_id, language, pages, publication_date, cover_image_url], (err, bookData) => {
            if (err) {
                fs.unlink(newPath, () => {}); 
                return res.send(result.createResult(err, null))
            }

            const book_id = bookData.insertId

            
            // 3. Insert into the book_inventory table
            const sqlInventory = `
                INSERT INTO book_inventory(book_id, store_id, price, mrp, stock_quantity, is_active)
                VALUES (?, ?, ?, ?, ?, 1)` 
            
            pool.query(sqlInventory, [book_id, store_id, price, mrp, stock_quantity], (err, inventoryData) => {
                if (err) {
                    return res.send(result.createResult(err, null))
                }
                res.send(result.createResult(null, { book: bookData, inventory: inventoryData }))
            })
        })
    })
})

