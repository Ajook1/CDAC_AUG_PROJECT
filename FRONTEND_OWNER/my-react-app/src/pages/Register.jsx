import { useState } from 'react';
import { ownerRegister } from '../api/storeApi';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Register = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        phone: ''
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 🔒 CLIENT-SIDE VALIDATION
        if (form.phone) {
            if (!/^[0-9]+$/.test(form.phone)) {
                toast.warn(' Phone number must contain only digits');
                return;
            }

            if (form.phone.length !== 10) {
                toast.warn(' Phone number must be exactly 10 digits');
                return;
            }
        }

        try {
            const res = await ownerRegister(form);

            if (res.data?.error) {
                toast.error(` ${res.data.error}`);
                return;
            }

            toast.success('🎉 Account created successfully');
            navigate('/login');
        } catch {
            toast.error(' Registration failed. Please try again.');
        }
    };

    return (
        <div className="container-fluid bg-light min-vh-100 d-flex align-items-center">
            <div className="row w-100 justify-content-center">
                <div className="col-12 col-sm-10 col-md-6 col-lg-4">
                    <div className="card shadow p-4">
                        <h3 className="text-center mb-4 fw-bold">
                            Owner Registration
                        </h3>

                        <form onSubmit={handleSubmit}>
                            <input
                                className="form-control mb-3"
                                name="name"
                                placeholder="Full Name"
                                onChange={handleChange}
                                required
                            />

                            <input
                                className="form-control mb-3"
                                type="email"
                                name="email"
                                placeholder="Email"
                                onChange={handleChange}
                                required
                            />

                            <input
                                className="form-control mb-3"
                                type="password"
                                name="password"
                                placeholder="Password"
                                onChange={handleChange}
                                required
                            />

                            <input
                                className="form-control mb-3"
                                name="phone"
                                placeholder="Phone (10 digits, optional)"
                                maxLength={10}
                                onChange={handleChange}
                            />

                            <button className="btn btn-primary w-100">
                                Register
                            </button>
                        </form>

                        <p className="text-center mt-3">
                            Already registered?{' '}
                            <Link to="/login">Login</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
