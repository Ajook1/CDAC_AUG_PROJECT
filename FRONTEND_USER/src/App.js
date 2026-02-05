import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Books from "./pages/Books";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import Addresses from "./pages/Addresses";
import ConfirmOrder from "./pages/ConfirmOrder";
import Wishlist from "./pages/Wishlist";
import UserLayout from "./layouts/UserLayout";
import ForgotPassword from "./pages/ForgotPassword";


import { getProfile, getCart } from "./services/api";

function App() {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // 🔁 reusable cart counter
  const refreshCartCount = async () => {
    try {
      const res = await getCart();
      if (res.data.status === "success") {
        setCartCount(res.data.data.length);
      } else {
        setCartCount(0);
      }
    } catch {
      setCartCount(0);
    }
  };

  // 🔐 AUTH CHECK ON LOAD
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await getProfile();

        if (res.data.status === "success") {
          setIsAuth(true);
          refreshCartCount();
        } else {
          localStorage.removeItem("token");
          setIsAuth(false);
        }
      } catch {
        localStorage.removeItem("token");
        setIsAuth(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <>
      <ToastContainer
        position="bottom-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
      />


      <Routes>
        {/* 🌐 Public */}
        <Route
          path="/login"
          element={
            !isAuth ? (
              <Login
                setIsAuth={setIsAuth}
                refreshCartCount={refreshCartCount}
              />
            ) : (
              <Navigate to="/books" />
            )
          }
        />

        <Route
          path="/signup"
          element={!isAuth ? <Signup /> : <Navigate to="/books" />}
        />

        <Route
          path="/"
          element={
            isAuth ? <Navigate to="/books" /> : <Navigate to="/login" />
          }
        />

        <Route
          path="/forgot-password"
          element={!isAuth ? <ForgotPassword /> : <Navigate to="/books" />}
        />


        {/* 🔐 Protected routes inside layout */}
        <Route
          element={
            isAuth ? (
              <UserLayout cartCount={cartCount} />
            ) : (
              <Navigate to="/login" />
            )
          }
        >
          <Route
            path="/books"
            element={<Books refreshCartCount={refreshCartCount} />}
          />
          <Route
            path="/cart"
            element={<Cart refreshCartCount={refreshCartCount} />}
          />
          <Route path="/orders" element={<Orders />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/addresses" element={<Addresses />} />
          <Route path="/confirm-order" element={<ConfirmOrder />} />
          <Route path="/profile" element={<Profile />} />
          

        </Route>

        {/* ❌ Fallback */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </>
  );
}

export default App;
