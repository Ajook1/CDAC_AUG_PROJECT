import { useEffect, useState } from "react";
import Navbar from "../component/Navbar";
import Sidebar from "../component/Sidebar";
import adminApi from "../api/adminApi";

const Publishers = () => {
  const [publishers, setPublishers] = useState([]);

  // CRUD state
  const [showForm, setShowForm] = useState(false);
  const [editPublisherId, setEditPublisherId] = useState(null);

  // FORM STATE (BACKEND ALIGNED)
  const [formData, setFormData] = useState({
    name: "",
    contact_info: ""
  });

  /* ================= LOAD PUBLISHERS ================= */

  const loadPublishers = () => {
    adminApi.get("/publishers").then(res => {
      if (res.data && res.data.data) {
        setPublishers(res.data.data);
      }
    });
  };

  useEffect(() => {
    loadPublishers();
  }, []);

  /* ================= FORM HANDLERS ================= */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setEditPublisherId(null);
    setFormData({
      name: "",
      contact_info: ""
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const apiCall = editPublisherId
      ? adminApi.put("/publishers", {
          publisher_id: editPublisherId,
          ...formData
        })
      : adminApi.post("/publishers", formData);

    apiCall.then(() => {
      resetForm();
      setShowForm(false);
      loadPublishers();
    });
  };

  /* ================= EDIT ================= */

  const editPublisher = (publisher) => {
    setEditPublisherId(publisher.publisher_id);
    setFormData({
      name: publisher.name,
      contact_info: publisher.contact_info || ""
    });
    setShowForm(true);
  };

  /* ================= DELETE ================= */

  const deletePublisher = (publisherId) => {
    if (!window.confirm("Delete this publisher?")) return;

    adminApi.delete("/publishers", {
      data: { publisher_id: publisherId }
    }).then(res => {
      // backend may return "Cannot delete" message
      if (res.data.status === "error") {
        alert(res.data.error);
      }
      loadPublishers();
    });
  };

  /* ================= UI ================= */

  return (
    <>
      <Navbar />

      <div className="d-flex">
        <Sidebar />

        <div className="container-fluid p-4">
          <h3 className="mb-3">Publishers Management</h3>

          {/* ADD PUBLISHER */}
          <button
            className="btn btn-primary mb-3"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
          >
            + Add Publisher
          </button>

          {/* ADD / EDIT FORM */}
          {showForm && (
            <form className="card p-3 mb-4" onSubmit={handleSubmit}>
              <h5>{editPublisherId ? "Edit Publisher" : "Add Publisher"}</h5>

              <input
                type="text"
                name="name"
                className="form-control mb-2"
                placeholder="Publisher Name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <textarea
                name="contact_info"
                className="form-control mb-2"
                placeholder="Contact Info (phone, email, address)"
                value={formData.contact_info}
                onChange={handleChange}
              />

              <div className="d-flex gap-2">
                <button className="btn btn-success" type="submit">
                  {editPublisherId ? "Update Publisher" : "Save Publisher"}
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

          {/* PUBLISHERS TABLE */}
          <table className="table table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Contact Info</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {publishers.map(publisher => (
                <tr key={publisher.publisher_id}>
                  <td>{publisher.publisher_id}</td>
                  <td>{publisher.name}</td>
                  <td>{publisher.contact_info || "-"}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => editPublisher(publisher)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => deletePublisher(publisher.publisher_id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {publishers.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center">
                    No publishers found
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

export default Publishers;
