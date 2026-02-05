import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import logo from '../assets/BOOKMITRA.webp'; // ✅ ADD YOUR LOGO IMAGE HERE

const Navbar = ({ children }) => {
    const { pathname } = useLocation();
    const navigate = useNavigate();

    // ⭐ Detect account pages
    const isAccountPage =
        pathname === '/profile' || pathname === '/change-password';

    // ⭐ Profile dropdown state
    const [openProfile, setOpenProfile] = useState(isAccountPage);

    useEffect(() => {
        if (isAccountPage) {
            setOpenProfile(true);
        }
    }, [isAccountPage]);

    // ⭐ Active link highlight
    const linkClass = (path) =>
        `nav-link text-white px-3 py-2 rounded ${pathname === path ? 'bg-primary fw-semibold' : ''
        }`;

    // ⭐ Logout handler
    const logout = () => {
        localStorage.removeItem('ownerToken');
        navigate('/login');
    };

    return (
        <div className="d-flex min-vh-100">
            {/* ================= SIDEBAR ================= */}
            <aside
                className="text-white p-3 d-flex flex-column justify-content-between"
                style={{ width: '240px', background: '#1f2933' }}
            >
                {/* TOP SECTION */}
                <div>
                    {/* LOGO */}
                    <div className="d-flex align-items-center gap-2 mb-4">
                        <img
                            src={logo}
                            alt="BookMitra"
                            style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '8px',
                                objectFit: 'cover'
                            }}
                        />
                        <span className="fs-5 fw-bold">BookMitra</span>
                    </div>

                    {/* NAV LINKS */}
                    <ul className="nav flex-column gap-1">
                        <li className="nav-item">
                            <Link to="/dashboard" className={linkClass('/dashboard')}>
                                Dashboard
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link to="/stores" className={linkClass('/stores')}>
                                Stores
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link to="/inventory" className={linkClass('/inventory')}>
                                Inventory
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link to="/orders" className={linkClass('/orders')}>
                                Orders
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* ================= PROFILE SECTION ================= */}
                <div>
                    <hr className="border-secondary" />

                    {/* ACCOUNT BUTTON */}
                    <button
                        className={`btn w-100 text-start fw-semibold ${openProfile || isAccountPage
                            ? 'btn-primary'
                            : 'btn-outline-light'
                            }`}
                        onClick={() => setOpenProfile(!openProfile)}
                    >
                        👤 My Account
                    </button>

                    {/* DROPDOWN */}
                    {openProfile && (
                        <div
                            className="mt-2 rounded p-2"
                            style={{ background: '#111827' }}
                        >
                            <button
                                className="btn btn-sm text-white w-100 text-start mb-2"
                                style={{ background: '#1f2933' }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate('/profile');
                                }}
                            >
                                View / Update Profile
                            </button>

                            <button
                                className="btn btn-sm text-white w-100 text-start mb-2"
                                style={{ background: '#1f2933' }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate('/change-password');
                                }}
                            >
                                Change Password
                            </button>

                            <button
                                className="btn btn-sm btn-danger w-100"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    logout();
                                }}
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </aside>

            {/* ================= MAIN CONTENT ================= */}
            <main className="flex-grow-1 bg-light d-flex flex-column">
                {/* ================= TOP BAR ================= */}
                <div
                    className="bg-primary text-white px-4 d-flex align-items-center justify-content-between shadow-sm"
                    style={{
                        height: '60px',
                        position: 'sticky',
                        top: 0,
                        zIndex: 100
                    }}
                >
                    <span className="fw-semibold fs-6">
                        BookMitra Owner Dashboard
                    </span>

                    {/* Optional future area (notifications, user badge, etc.) */}
                    {/* <div>🔔</div> */}
                </div>

                {/* ================= PAGE CONTENT ================= */}
                <div
                    className="flex-grow-1"
                    style={{
                        padding: '24px',
                        overflowY: 'auto'
                    }}
                >
                    <div
                        className="bg-white rounded shadow-sm"
                        style={{
                            minHeight: 'calc(100vh - 120px)',
                            padding: '24px'
                        }}
                    >
                        {children}
                    </div>
                </div>
            </main>

        </div>
    );
};

export default Navbar;
