import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { userSignup } from "../services/api";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, mobile, password } = form;

    // 🔐 Validation
    if (!name || !email || !mobile || !password) {
      toast.error("All fields are mandatory");
      return;
    }

    if (mobile.length !== 10) {
      toast.error("Mobile number must be 10 digits");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      // 📡 Signup API (NEW BACKEND)
      const res = await userSignup({
        name,
        email,
        phone: mobile,
        password
      });

      // ✅ RESULT.JS FORMAT HANDLING
      if (res.data.status === "error") {
        toast.error(res.data.error || "Signup failed");
        return;
      }

      toast.success("Signup successful 🎉 Please login");

      // 🚀 Redirect to login
      setTimeout(() => {
        navigate("/login");
      }, 800);

    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="container-fluid bg-light min-vh-100 d-flex align-items-center">
      <div className="row w-100 justify-content-center">
        <div className="col-12 col-sm-10 col-md-7 col-lg-5 col-xl-4">
          <div className="card p-4 shadow">
            <h3 className="text-center mb-4">User Signup</h3>

            <form onSubmit={handleSubmit}>
              <input
                className="form-control mb-3"
                name="name"
                placeholder="Name"
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
                name="mobile"
                placeholder="Mobile"
                onChange={handleChange}
                required
              />

              <input
                className="form-control mb-4"
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                required
              />

              <button className="btn btn-primary w-100">
                Signup
              </button>
            </form>

            <p className="text-center mt-3 mb-0">
              Already have an account?{" "}
              <span
                className="text-primary fw-semibold"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/login")}
              >
                Login
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
