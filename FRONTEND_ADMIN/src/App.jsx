import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Books from "./pages/Books";
import Bookstores from "./pages/Bookstores";
import Authors from "./pages/Authors";
import Categories from "./pages/Categories";
import Publishers from "./pages/Publishers";
import Orders from "./pages/Orders";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/dashboard" />} />

        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/users" element={<Users />} />
        <Route path="/admin/books" element={<Books />} />
        <Route path="/admin/bookstores" element={<Bookstores />} />
        <Route path="/admin/authors" element={<Authors />} />
        <Route path="/admin/categories" element={<Categories />} />
        <Route path="/admin/publishers" element={<Publishers />} />
        <Route path="/admin/orders" element={<Orders />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
