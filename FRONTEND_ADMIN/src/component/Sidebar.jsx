import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sidebar p-3">
      <h5 className="text-white mb-4">Admin</h5>

      <NavLink to="/admin/dashboard" className="nav-link mb-2">
         Dashboard
      </NavLink>

      <NavLink to="/admin/users" className="nav-link mb-2">
         Users
      </NavLink>

      <NavLink to="/admin/books" className="nav-link mb-2">
         Books
      </NavLink>

      <NavLink to="/admin/bookstores" className="nav-link mb-2">
         Bookstores
      </NavLink>

      <NavLink to="/admin/authors" className="nav-link mb-2">
         Authors
      </NavLink>

      <NavLink to="/admin/categories" className="nav-link mb-2">
         Categories
      </NavLink>

      <NavLink to="/admin/publishers" className="nav-link mb-2">
         Publishers
      </NavLink>

      <NavLink to="/admin/orders" className="nav-link mb-2">
         Orders
      </NavLink>
    </div>
  );
};

export default Sidebar;
