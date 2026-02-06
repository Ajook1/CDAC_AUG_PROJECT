import { useEffect, useState } from "react";
import {
  getProfile,
  getBooks,
  getCart,
  getOrders
} from "../services/api";

function Dashboard() {
  const [userName, setUserName] = useState("");
  const [totalBooks, setTotalBooks] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        // 👤 USER PROFILE
        const profileRes = await getProfile();
        if (profileRes.data.status === "success") {
          setUserName(profileRes.data.data.name);
        }

        // 📚 TOTAL BOOKS (inventory-based)
        const booksRes = await getBooks();
        if (booksRes.data.status === "success") {
          setTotalBooks(booksRes.data.data.length);
        }

        // 🛒 CART COUNT
        const cartRes = await getCart();
        if (cartRes.data.status === "success") {
          setCartCount(cartRes.data.data.length);
        }

        // 📦 ORDERS COUNT
        const orderRes = await getOrders();
        if (orderRes.data.status === "success") {
          setOrderCount(orderRes.data.data.length);
        }

      } catch {
        // Silent fail (dashboard should not block user)
      }
    };

    loadDashboard();
  }, []);

  return (
    <div className="container mt-4">

      {/* 🔹 WELCOME */}
      <div className="card shadow-sm mb-4">
        <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-center text-center text-md-start">
          <div>
            <h4 className="mb-1">
              Welcome, {userName} 👋
            </h4>
            <p className="text-muted mb-0">
              Here’s a quick overview of your account
            </p>
          </div>

          <img
            src="https://cdn-icons-png.flaticon.com/512/29/29302.png"
            alt="books"
            className="mt-3 mt-md-0"
            style={{ width: "70px", opacity: 0.8 }}
          />
        </div>
      </div>

      {/* 🔹 SUMMARY CARDS */}
      <div className="row">

        <div className="col-lg-4 col-md-6 mb-3">
          <div className="card shadow-sm h-100 text-center">
            <div className="card-body">
              <div className="fs-1">📚</div>
              <h6 className="text-muted">Total Books</h6>
              <h3>{totalBooks}</h3>
            </div>
          </div>
        </div>

        <div className="col-lg-4 col-md-6 mb-3">
          <div className="card shadow-sm h-100 text-center">
            <div className="card-body">
              <div className="fs-1">🛒</div>
              <h6 className="text-muted">Cart Items</h6>
              <h3>{cartCount}</h3>
            </div>
          </div>
        </div>

        <div className="col-lg-4 col-md-12 mb-3">
          <div className="card shadow-sm h-100 text-center">
            <div className="card-body">
              <div className="fs-1">📦</div>
              <h6 className="text-muted">My Orders</h6>
              <h3>{orderCount}</h3>
            </div>
          </div>
        </div>

      </div>

      {/* 🔹 QUICK ACTIONS */}
      <div className="card shadow-sm mt-4">
        <div className="card-body">
          <h5 className="mb-3">Quick Actions</h5>

          <div className="row g-2">
            <div className="col-md-3 col-sm-6">
              <a href="/books" className="btn btn-primary w-100">
                Browse Books
              </a>
            </div>

            <div className="col-md-3 col-sm-6">
              <a href="/cart" className="btn btn-outline-success w-100">
                View Cart
              </a>
            </div>

            <div className="col-md-3 col-sm-6">
              <a href="/orders" className="btn btn-outline-warning w-100">
                My Orders
              </a>
            </div>

            <div className="col-md-3 col-sm-6">
              <a href="/profile" className="btn btn-outline-secondary w-100">
                Profile
              </a>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}

export default Dashboard;
