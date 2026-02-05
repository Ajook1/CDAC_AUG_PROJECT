import axios from "axios";

console.log("REACT_APP_API_URL =", process.env.REACT_APP_API_URL);

const API = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/api`,
});
//for the redeploy
// Attach JWT
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

/* ===================== AUTH ===================== */
export const userSignup = (data) =>
  API.post("/user/auth/signup", data);

export const userSignin = (data) =>
  API.post("/user/auth/signin", data);

/* ===================== PROFILE ===================== */
export const getProfile = () =>
  API.get("/user/profile");

export const updateProfile = (data) =>
  API.put("/user/profile", data);

export const changePassword = (data) =>
  API.put("/user/profile/password", data);

/* ===================== ADDRESS ===================== */
export const getAddresses = () =>
  API.get("/user/address");

export const addAddress = (data) =>
  API.post("/user/address", data);

export const updateAddress = (id, data) =>
  API.put(`/user/address/${id}`, data);

export const deleteAddress = (id) =>
  API.delete(`/user/address/${id}`);

/* ===================== BOOKS ===================== */
export const getBooks = () =>
  API.get("/user/books");

export const getBook = (id) =>
  API.get(`/user/books/${id}`);

export const searchBooks = (q) =>
  API.get(`/user/books/search?q=${q}`);

export const getBooksByCategory = (id) =>
  API.get(`/user/books/category/${id}`);

/* ===================== CART ===================== */
export const getCart = () =>
  API.get("/user/cart");

export const addToCart = (data) =>
  API.post("/user/cart", data);

export const updateCartItem = (id, data) =>
  API.put(`/user/cart/${id}`, data);

export const deleteCartItem = (id) =>
  API.delete(`/user/cart/${id}`);

/* ===================== ORDERS ===================== */
export const placeOrder = (data) =>
  API.post("/user/orders", data);

export const getOrders = () =>
  API.get("/user/orders");

export const getOrderDetails = (id) =>
  API.get(`/user/orders/${id}`);

export const cancelOrder = (id) =>
  API.patch(`/user/orders/${id}/cancel`);

/* ===================== PAYMENTS ===================== */
export const initiateCOD = (data) =>
  API.post("/user/payments/cod", data);

export const getPaymentStatus = (orderId) =>
  API.get(`/user/payments/${orderId}/status`);

/* ===================== REVIEWS ===================== */
export const addReview = (data) =>
  API.post("/user/reviews", data);

export const getReviews = (bookId) =>
  API.get(`/user/reviews/${bookId}`);

export const deleteReview = (id) =>
  API.delete(`/user/reviews/${id}`);

/* ===================== WISHLIST ===================== */
export const getWishlist = () =>
  API.get("/user/wishlist");

export const addToWishlist = (data) =>
  API.post("/user/wishlist", data);

export const removeFromWishlist = (inventoryId) =>
  API.delete(`/user/wishlist/${inventoryId}`);


export default API;
