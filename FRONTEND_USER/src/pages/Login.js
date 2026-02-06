import { useState } from "react";
import { userSignin } from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";



const Login = ({ setIsAuth, refreshCartCount }) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.warning("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const res = await userSignin({ email, password });

      // ❌ error case from backend
      if (res.data.status === "error") {
        toast.error(res.data.error || res.data.message || "Login failed");
        return;
      }

      // ✅ FIXED: token is at res.data.token
      const token = res.data.token;

      if (!token) {
        toast.error("Token not received from server");
        return;
      }

      // ✅ Save token
      localStorage.setItem("token", token);

      // ✅ Auth state
      setIsAuth(true);

      // ✅ Refresh cart badge
      refreshCartCount();

      toast.success("Login successful 🎉");

      // ✅ Redirect
      navigate("/books");

    } catch (err) {
      console.error("Login error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid bg-light min-vh-100 d-flex align-items-center justify-content-center">
      <div className="row w-100 justify-content-center">
        <div className="col-11 col-sm-9 col-md-6 col-lg-4 col-xl-3">
          <div className="card shadow-lg border-0">
            <div className="card-body p-4 p-md-5">

              <h3 className="text-center mb-2 fw-bold">
                Welcome Back 👋
              </h3>
              <p className="text-center text-muted mb-4">
                Login to continue
              </p>

              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <input
                    className="form-control"
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <input
                    className="form-control"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button
                  className="btn btn-primary w-100 py-2 mt-2"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>

              <p className="text-center mt-2">
                <span
                  style={{ cursor: "pointer", color: "#0d6efd" }}
                  onClick={() => navigate("/forgot-password")}
                >
                  Forgot Password?
                </span>
              </p>


              <p className="text-center mt-4 mb-0">
                New user?{" "}
                <Link to="/signup" className="fw-semibold">
                  Register here
                </Link>
              </p>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
