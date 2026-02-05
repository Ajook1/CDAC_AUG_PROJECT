// auth/upload.js

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ⭐ NEW: Ensure uploads folder exists
const uploadDir = path.join(__dirname, '..', 'uploads');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // ⭐ FIXED: absolute safe path
    },
    filename: (req, file, cb) => {
        const uniqueName =
            Date.now() + '-' + Math.round(Math.random() * 1e9);

        cb(null, uniqueName + path.extname(file.originalname));
    }
});

// File filter (images only)
const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/webp'
    ) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed'), false);
    }
};

// Create multer instance
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024 // ⭐ NEW: 2MB limit (best practice)
    }
});

module.exports = upload;
