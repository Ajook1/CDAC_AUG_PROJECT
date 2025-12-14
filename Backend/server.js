// builtin modules
const express = require('express')
const cors = require('cors')

// userdefined modules (CLIENT/USER ROUTES)
const authRouter = require('./routes/auth')         
const booksClientRouter = require('./routes/user/books') 
const cartClientRouter = require('./routes/user/cart')     
const ordersClientRouter = require('./routes/user/orders') 

// userdefined modules (ADMIN ROUTES)
// ✅ UPDATED: Points to 'dashboard.js' instead of 'admin.js'
const adminDashboardRouter = require('./routes/admin/dashboard') 
const adminUserRouter = require('./routes/admin/users')      
const adminBookRouter = require('./routes/admin/books')
const adminCategoryRouter = require('./routes/admin/categories')
const adminOrderRouter = require('./routes/admin/orders')
const adminAuthorRouter = require('./routes/admin/authors')      // New
const adminPublisherRouter = require('./routes/admin/publishers') // New


// userdefined modules (BOOKSTORE OWNER ROUTES)
const storeAuthRouter = require('./routes/owner/auth')
const storeStoreRouter = require('./routes/owner/store')
const storeInventoryRouter = require('./routes/owner/inventory')
const storeOrdersRouter = require('./routes/owner/orders')


const app = express()

// Middlewares
app.use('/bookcovers', express.static('bookcovers'))
app.use('/storeimages', express.static('storeimages')) 
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors()) 

// =========================================================================
// ROUTE MOUNTS (CLIENT/USER FACING)
// =========================================================================

app.use('/user', authRouter)            
app.use('/books', booksClientRouter)    
app.use('/cart', cartClientRouter)      
app.use('/orders', ordersClientRouter)  


// =========================================================================
// ROUTE MOUNTS (ADMIN/MANAGEMENT)
// =========================================================================

// ✅ This router handles "GET /admin/dashboard"
app.use('/admin', adminDashboardRouter) 

app.use('/admin/users', adminUserRouter) 
app.use('/admin/books', adminBookRouter) 
app.use('/admin/categories', adminCategoryRouter) 
app.use('/admin/orders', adminOrderRouter) 
app.use('/admin/authors', adminAuthorRouter)       
app.use('/admin/publishers', adminPublisherRouter) 


// =========================================================================
// ROUTE MOUNTS (BOOKSTORE OWNER)
// =========================================================================

app.use('/store/auth', storeAuthRouter)         
app.use('/store/profile', storeStoreRouter)     
app.use('/store/inventory', storeInventoryRouter) 
app.use('/store/orders', storeOrdersRouter)     


app.listen(4000, 'localhost', () => {
    console.log('Bookstore Server (All Roles) started at port 4000')
})