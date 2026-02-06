import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function ForgotPassword() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const navigate = useNavigate();


    const sendOTP = async () => {
        try {
            const res = await API.post("/user/auth/forgot-password", { email });
            if (res.data.status === "success") {
                toast.success("OTP sent to email");
                setStep(2);
            } else {
                toast.error(res.data.message);
            }
        } catch {
            toast.error("Error sending OTP");
        }
    };

    const resetPassword = async () => {
        try {
            const res = await API.post("/user/auth/reset-password", {
                email,
                otp,
                newPassword,
            });

            if (res.data.status === "success") {
                toast.success("Password reset successful. Please login.");
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            }
            else {
                toast.error(res.data.message);
            }
        } catch {
            toast.error("Reset failed");
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: "400px" }}>
            <h3 className="text-center mb-4">Forgot Password</h3>

            {step === 1 && (
                <>
                    <input
                        className="form-control mb-3"
                        placeholder="Enter Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button className="btn btn-primary w-100" onClick={sendOTP}>
                        Send OTP
                    </button>
                </>
            )}

            {step === 2 && (
                <>
                    <input
                        className="form-control mb-3"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />
                    <input
                        className="form-control mb-3"
                        placeholder="New Password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <button className="btn btn-success w-100" onClick={resetPassword}>
                        Reset Password
                    </button>
                </>
            )}
        </div>
    );
}

export default ForgotPassword;
