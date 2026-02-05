import { useState } from 'react';
import { ownerLogin } from '../api/storeApi';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await ownerLogin({ email, password });

            // ❌ ERROR FROM BACKEND
            if (res.data?.error) {
                toast.error(res.data.error);
                setLoading(false);
                return;
            }

            // ✅ SUCCESS
            localStorage.setItem('ownerToken', res.data.data.token);
            toast.success('Login successful');
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            toast.error('Something went wrong. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid bg-light min-vh-100 d-flex align-items-center">
            <div className="row w-100 justify-content-center">
                <div className="col-12 col-sm-10 col-md-6 col-lg-4">
                    <div className="card shadow p-4">
                        <h3 className="text-center mb-4">
                            BookMitra Owner Login
                        </h3>

                        <form onSubmit={handleLogin}>
                            <input
                                className="form-control mb-3"
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />

                            <input
                                className="form-control mb-3"
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />

                            {/* <p className="text-end mb-2">
                                <span
                                    style={{ cursor: "pointer", color: "#0d6efd", fontSize: "14px" }}
                                    onClick={() => navigate("/owner/forgot-password")}
                                >
                                    Forgot Password?
                                </span>
                            </p> */}


                            <button
                                className="btn btn-primary w-100"
                                disabled={loading}
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </button>
                        </form>

                        <p className="text-center mt-3">
                            New owner? <Link to="/register">Register</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
