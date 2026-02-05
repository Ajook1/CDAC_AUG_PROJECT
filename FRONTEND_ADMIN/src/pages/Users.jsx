import { useEffect, useState } from "react";
import Navbar from "../component/Navbar";
import Sidebar from "../component/Sidebar";
import adminApi from "../api/adminApi";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [editUserId, setEditUserId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // FORM STATE (DB aligned)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role_id: 1,
    is_active: 1
  });


  // LOAD USERS
  const loadUsers = () => {
    adminApi.get("/users").then(res => {
      if (res.data && res.data.data) {
        setUsers(res.data.data);
      }
    });
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // HANDLE INPUT CHANGE (type-safe)
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]:
        name === "role_id" || name === "is_active"
          ? Number(value)
          : value
    }));
  };


  // CREATE / UPDATE
  const handleSubmit = (e) => {
    e.preventDefault();

    //  ADD THIS LINE
    console.log("Submitting role_id:", formData.role_id);

    const apiCall = editUserId
      ? adminApi.put("/users", { ...formData, user_id: editUserId })
      : adminApi.post("/users", formData);

    apiCall.then(() => {
      resetForm();
      setShowForm(false);
      loadUsers();
    });
  };


  // EDIT USER
  const editUser = (user) => {
    setEditUserId(user.user_id);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      password: "",
      role_id: user.role_id,
      is_active: user.is_active
    });
    setShowForm(true);
  };

  // DELETE USER
  const deleteUser = (userId) => {
    if (!window.confirm("Delete this user?")) return;

    adminApi.delete("/users", {
      data: { user_id: userId }
    }).then(() => loadUsers());
  };

  // ENABLE / DISABLE USER
  const toggleStatus = (userId, currentStatus) => {
    adminApi.put("/users/status", {
      user_id: userId,
      is_active: currentStatus === 1 ? 0 : 1
    }).then(() => loadUsers());
  };


  // RESET FORM
  const resetForm = () => {
    setEditUserId(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
      role_id: 2,
      is_active: 1
    });
  };

  return (
    <>
      <Navbar />

      <div className="d-flex">
        <Sidebar />

        <div className="container-fluid p-4">
          <h3 className="mb-3">Users Management</h3>

          {/* ADD USER BUTTON */}
          <button
            className="btn btn-primary mb-3"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
          >
            + Add User
          </button>

          {/* CREATE / EDIT FORM */}
          {showForm && (
            <form className="card p-3 mb-4" onSubmit={handleSubmit}>
              <h5 className="mb-3">
                {editUserId ? "Edit User" : "Add User"}
              </h5>

              {/* ROW 1 */}
              <div className="row g-2">
                <div className="col-md-3">
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-3">
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-3">
                  <input
                    type="text"
                    name="phone"
                    className="form-control"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-3">
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required={!editUserId}
                  />
                </div>
              </div>

              {/* ROW 2 */}
              <div className="row g-2 mt-2">
                <div className="col-md-3">
                  <select
                    name="role_id"
                    className="form-select"
                    value={formData.role_id}
                    onChange={handleChange}
                  >
                    <option value={1}>Admin</option>
                    <option value={2}>User</option>
                    <option value={3}>Store Owner</option>
                  </select>
                </div>

                <div className="col-md-3">
                  <select
                    name="is_active"
                    className="form-select"
                    value={formData.is_active}
                    onChange={handleChange}
                  >
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                  </select>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="mt-3 d-flex gap-2">
                <button className="btn btn-success" type="submit">
                  {editUserId ? "Update User" : "Save User"}
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    resetForm();
                    setShowForm(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}


          {/* USERS TABLE */}
          <table className="table table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map(user => (
                <tr key={user.user_id}>
                  <td>{user.user_id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.role_name}</td>
                  <td>
                    {user.is_active === 1 ? (
                      <span className="badge bg-success">Active</span>
                    ) : (
                      <span className="badge bg-danger">Inactive</span>
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => editUser(user)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-sm btn-danger me-2"
                      onClick={() => deleteUser(user.user_id)}
                    >
                      Delete
                    </button>

                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => toggleStatus(user.user_id, user.is_active)}
                    >
                      {user.is_active === 1 ? "Disable" : "Enable"}
                    </button>

                  </td>
                </tr>
              ))}

              {users.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Users;
