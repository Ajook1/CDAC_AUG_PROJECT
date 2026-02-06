import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";
import {
  getProfile,
  updateProfile,
  changePassword
} from "../services/api";

function Profile() {
  const [activeTab, setActiveTab] = useState("profile");

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: ""
  });

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [loading, setLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);

  // 🔹 LOAD PROFILE
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await getProfile();

        if (res.data.status === "error") {
          setSessionExpired(true);
          return;
        }

        setProfile(res.data.data);
      } catch {
        setSessionExpired(true);
        toast.error("Session expired. Please login again.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // 🔹 UPDATE PROFILE
  const handleUpdateProfile = async () => {
    try {
      const res = await updateProfile({
        name: profile.name,
        phone: profile.phone
      });

      if (res.data.status === "error") {
        toast.error(res.data.error);
        return;
      }

      toast.success("Profile updated successfully ✅");
    } catch {
      toast.error("Failed to update profile ❌");
    }
  };

  // 🔹 CHANGE PASSWORD
  const handleChangePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.warning("Passwords do not match ⚠️");
      return;
    }

    if (passwords.newPassword.length < 6) {
      toast.warning("Password must be at least 6 characters");
      return;
    }

    try {
      const res = await changePassword({
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword
      });

      if (res.data.status === "error") {
        toast.error(res.data.error);
        return;
      }

      toast.success("Password changed successfully 🔐");

      setPasswords({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch {
      toast.error("Failed to change password ❌");
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        Loading profile...
      </div>
    );
  }

  if (sessionExpired) {
    localStorage.removeItem("token");
    return <Navigate to="/login" />;
  }

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-11 col-md-8 col-lg-6">

          <h3 className="mb-3">👤 My Profile</h3>

          {/* 🔹 TABS */}
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "profile" ? "active" : ""
                  }`}
                onClick={() => setActiveTab("profile")}
              >
                Profile Info
              </button>
            </li>

            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "password" ? "active" : ""
                  }`}
                onClick={() => setActiveTab("password")}
              >
                Change Password
              </button>
            </li>
          </ul>

          {/* 🔹 PROFILE TAB */}
          {activeTab === "profile" && (
            <div className="card p-4 mt-3 shadow-sm">
              <input
                className="form-control mb-3"
                placeholder="Name"
                value={profile.name}
                onChange={e =>
                  setProfile({ ...profile, name: e.target.value })
                }
              />

              <input
                className="form-control mb-3"
                value={profile.email}
                disabled
              />

              <input
                className="form-control mb-4"
                placeholder="Phone"
                value={profile.phone}
                onChange={e =>
                  setProfile({ ...profile, phone: e.target.value })
                }
              />

              <button
                className="btn btn-primary w-100"
                onClick={handleUpdateProfile}
              >
                Update Profile
              </button>
            </div>
          )}

          {/* 🔹 PASSWORD TAB */}
          {activeTab === "password" && (
            <div className="card p-4 mt-3 shadow-sm">
              <input
                type="password"
                className="form-control mb-3"
                placeholder="Old Password"
                value={passwords.oldPassword}
                onChange={e =>
                  setPasswords({
                    ...passwords,
                    oldPassword: e.target.value
                  })
                }
              />

              <input
                type="password"
                className="form-control mb-3"
                placeholder="New Password"
                value={passwords.newPassword}
                onChange={e =>
                  setPasswords({
                    ...passwords,
                    newPassword: e.target.value
                  })
                }
              />

              <input
                type="password"
                className="form-control mb-4"
                placeholder="Confirm New Password"
                value={passwords.confirmPassword}
                onChange={e =>
                  setPasswords({
                    ...passwords,
                    confirmPassword: e.target.value
                  })
                }
              />

              <button
                className="btn btn-warning w-100"
                onClick={handleChangePassword}
              >
                Change Password
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Profile;
