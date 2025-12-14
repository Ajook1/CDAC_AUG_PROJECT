const express = require('express')
const multer = require('multer')
const fs = require('fs')

const pool = require('../utils/db')
const result = require('../utils/result')

const router = express.Router()

// Setup multer for image upload - ensure 'bookcovers' directory exists
const upload = multer({ dest: 'bookcovers' }) 
