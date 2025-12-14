# CDAC_AUG_PROJECT

📚 Online Bookstore – Owner Management Backend

This project is a Node.js + Express + MySQL backend for an Online Bookstore system.
It supports Admin-added books, Owner-added books, store management, inventory management, and secure APIs using JWT authentication.

🚀 Features
👤 Roles

Admin (Super User) – Manages master book catalog

Bookstore Owner – Manages store and inventory

User (Customer) – Purchases books (future scope)

🏪 Owner Features

Owner registration & login (JWT based)

Create and manage bookstore

Add books to inventory

Add existing (admin-added) books to store

Add new (owner-created) books

Update price, stock, and availability

Upload store image

View low-stock and top-selling books

📦 Inventory Management

List store inventory

Add book to inventory

Update inventory details

Delete inventory items

Update stock and price separately

🛠 Tech Stack

Node.js

Express.js

MySQL

JWT (jsonwebtoken)

bcrypt

multer (file uploads)

cors

📁 Project Structure
BOOKSTORE_OWNER/
│
├── auth/
│   └── authMiddleware.js
│
├── routes/
│   ├── ownerAuth.js
│   ├── ownerStore.js
│   ├── ownerInventory.js
│
├── utils/
│   ├── db.js
│   └── result.js
│
├── uploads/
│
├── config.js
├── server.js
└── package.json

🔐 Authentication

All owner APIs are protected using JWT.

Header Format:
Authorization: Bearer <JWT_TOKEN>

🔁 Book Handling Logic

The system supports two types of books:

✅ Admin-Added Books

Stored in books table

Available to all owners

✅ Owner-Added Books

Created by owner

Stored in books table with metadata

Linked to owner inventory