// ================== server.js ==================
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;


// ================== MIDDLEWARES ==================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/bookcovers', express.static('bookcovers'));
app.use('/storeimages', express.static('storeimages'));

// ================== IMPORT ROUTES ==================

// ADMIN
const adminDashboardRouter = require('./routes/admin/dashboard');
const adminUserRouter = require('./routes/admin/users');
const adminBookRouter = require('./routes/admin/books');
const adminCategoryRouter = require('./routes/admin/categories');
const adminOrderRouter = require('./routes/admin/orders');
const adminAuthorRouter = require('./routes/admin/authors');
const adminPublisherRouter = require('./routes/admin/publishers');
const adminBookstoreRouter = require('./routes/admin/bookstores');

// USER
const userAuthRoutes = require("./routes/user/auth.routes");
const userProfileRoutes = require("./routes/user/profile.routes");
const userAddressRoutes = require("./routes/user/address.routes");
const userBookRoutes = require("./routes/user/book.routes");
const userCartRoutes = require("./routes/user/cart.routes");
const userOrderRoutes = require("./routes/user/order.routes");
const userPaymentRoutes = require("./routes/user/payment.routes");
const userReviewRoutes = require("./routes/user/review.routes");
const userWishlistRoutes = require("./routes/user/wishlist.routes");

// OWNER
const ownerAuthRoutes = require('./routes/storeOwner/ownerAuth');
const ownerStoreRoutes = require('./routes/storeOwner/ownerStore');
const ownerInventoryRoutes = require('./routes/storeOwner/ownerInventory');
const ownerOrdersRoutes = require('./routes/storeOwner/ownerOrders');
const ownerDashboardRoutes = require('./routes/storeOwner/ownerDashboard');

// ================== ADMIN ROUTES ==================
app.use('/admin/dashboard', adminDashboardRouter);
app.use('/admin/users', adminUserRouter);
app.use('/admin/books', adminBookRouter);
app.use('/admin/categories', adminCategoryRouter);
app.use('/admin/orders', adminOrderRouter);
app.use('/admin/authors', adminAuthorRouter);
app.use('/admin/publishers', adminPublisherRouter);
app.use('/admin/bookstores', adminBookstoreRouter);

// ================== USER ROUTES ==================
app.use("/api/user/auth", userAuthRoutes);
app.use("/api/user/profile", userProfileRoutes);
app.use("/api/user/address", userAddressRoutes);
app.use("/api/user/books", userBookRoutes);
app.use("/api/user/cart", userCartRoutes);
app.use("/api/user/orders", userOrderRoutes);
app.use("/api/user/payments", userPaymentRoutes);
app.use("/api/user/reviews", userReviewRoutes);
app.use("/api/user/wishlist", userWishlistRoutes);

// ================== OWNER ROUTES ==================
app.use("/api/owner/auth", ownerAuthRoutes);
app.use("/api/owner/store", ownerStoreRoutes);
app.use("/api/owner/inventory", ownerInventoryRoutes);
app.use("/api/owner/orders", ownerOrdersRoutes);
app.use("/api/owner/dashboard", ownerDashboardRoutes);

// ================== SERVER START ==================
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});;
