// utils/db.js

const mysql = require('mysql2');


const pool = mysql.createPool({
    host: 'localhost',         
    user: 'root',              
    password: 'manager',       
    database: 'online_bookstore',      
});

module.exports = pool;
