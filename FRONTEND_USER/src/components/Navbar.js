
import { Link } from "react-router-dom";


function Navbar({ cartCount }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3 shadow-sm">

      {/* BRAND */}
      <Link
        className="navbar-brand fw-bold d-flex align-items-center"
        to="/dashboard"
      >
        <img
          src="/BookMitra_Logo.jpeg"
          alt="BookMitra"
          style={{
            height: "36px",
            width: "36px",
            objectFit: "contain",
            marginRight: "10px"
          }}
        />
        BookMitra
      </Link>


      {/* HAMBURGER (MOBILE) */}
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#mainNavbar"
        aria-controls="mainNavbar"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      {/* NAV LINKS */}
      <div className="collapse navbar-collapse" id="mainNavbar">
        <ul className="navbar-nav ms-auto align-items-lg-center">

          {/* <li className="nav-item">
            <Link className="nav-link fw-semibold" to="/dashboard">
              Dashboard
            </Link>
          </li> */}

          <li className="nav-item">
            <Link className="nav-link fw-semibold" to="/books">
              Books
            </Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link fw-semibold" to="/cart">
              Cart{" "}
              {cartCount > 0 && (
                <span className="badge bg-success ms-1">
                  {cartCount}
                </span>
              )}
            </Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link fw-semibold" to="/orders">
              Orders
            </Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link fw-semibold" to="/wishlist">
              Wishlist
            </Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link fw-semibold" to="/addresses">
              Addresses
            </Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link fw-semibold" to="/profile">
              Profile
            </Link>
          </li>

          {/* LOGOUT */}
          <li className="nav-item ms-lg-3">
            <span
              className="nav-link text-danger fw-semibold"
              style={{ cursor: "pointer" }}
              onClick={() => {
                localStorage.clear();
                sessionStorage.clear();
                window.location.replace("/login");
              }}
            >
              Logout
            </span>
          </li>

        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
