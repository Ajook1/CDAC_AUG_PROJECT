// Builtin Modules
const express = require('express')
const cors = require('cors')
const app = express()

// ADMIN ROUTES
const adminDashboardRouter = require('./routes/admin/dashboard') 
const adminUserRouter = require('./routes/admin/users')      
const adminBookRouter = require('./routes/admin/books')
const adminCategoryRouter = require('./routes/admin/categories')
const adminOrderRouter = require('./routes/admin/orders')
const adminAuthorRouter = require('./routes/admin/authors')      
const adminPublisherRouter = require('./routes/admin/publishers') 


// USER ROUTES const

// BOOKSTORE OWNER ROUTES const



// Middlewares
app.use('/bookcovers', express.static('bookcovers'))
app.use('/storeimages', express.static('storeimages')) 
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors()) 



// ROUTE MOUNTS (ADMIN)
app.use('/admin/dashboard', adminDashboardRouter) 
app.use('/admin/users', adminUserRouter) 
app.use('/admin/books', adminBookRouter) 
app.use('/admin/categories', adminCategoryRouter) 
app.use('/admin/orders', adminOrderRouter) 
app.use('/admin/authors', adminAuthorRouter)       
app.use('/admin/publishers', adminPublisherRouter) 


// ROUTE MOUNTS (USER) app.use

// ROUTE MOUNTS (BOOKSTORE OWNER) //app.use



app.listen(4000, 'localhost', () => {
    console.log('Bookstore Server (All Roles) started at port 4000')
})