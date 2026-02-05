import { useEffect, useState } from "react";
import Navbar from "../component/Navbar";
import Sidebar from "../component/Sidebar";
import adminApi from "../api/adminApi";

const Authors = () => {
  const [authors, setAuthors] = useState([]);

  // CRUD state
  const [showForm, setShowForm] = useState(false);
  const [editAuthorId, setEditAuthorId] = useState(null);

  // FORM STATE (DB aligned)
  const [formData, setFormData] = useState({
    name: "",
    biography: ""
  });


  // LOAD AUTHORS

  const loadAuthors = () => {
    adminApi.get("/authors").then(res => {
      if (res.data && res.data.data) {
        setAuthors(res.data.data);
      }
    });
  };

  useEffect(() => {
    loadAuthors();
  }, []);


  // FORM HANDLERS

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setEditAuthorId(null);
    setFormData({
      name: "",
      biography: ""
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const apiCall = editAuthorId
      ? adminApi.put("/authors", {
          author_id: editAuthorId,
          ...formData
        })
      : adminApi.post("/authors", formData);

    apiCall.then(() => {
      resetForm();
      setShowForm(false);
      loadAuthors();
    });
  };


  // EDIT AUTHOR

  const editAuthor = (author) => {
    setEditAuthorId(author.author_id);
    setFormData({
      name: author.name,
      biography: author.biography || ""
    });
    setShowForm(true);
  };

  
  // DELETE AUTHOR

  const deleteAuthor = (authorId) => {
    if (!window.confirm("Delete this author?")) return;

    adminApi.delete("/authors", {
      data: { author_id: authorId }
    }).then(() => loadAuthors());
  };

 
  // UI

  return (
    <>
      <Navbar />

      <div className="d-flex">
        <Sidebar />

        <div className="container-fluid p-4">
          <h3 className="mb-3">Authors Management</h3>

          {/* ADD AUTHOR */}
          <button
            className="btn btn-primary mb-3"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
          >
            + Add Author
          </button>

          {/* ADD / EDIT FORM */}
          {showForm && (
            <form className="card p-3 mb-4" onSubmit={handleSubmit}>
              <h5>{editAuthorId ? "Edit Author" : "Add Author"}</h5>

              <input
                type="text"
                name="name"
                className="form-control mb-2"
                placeholder="Author Name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <textarea
                name="biography"
                className="form-control mb-2"
                placeholder="Biography"
                value={formData.biography}
                onChange={handleChange}
              />

              <div className="d-flex gap-2">
                <button className="btn btn-success" type="submit">
                  {editAuthorId ? "Update Author" : "Save Author"}
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

          {/* AUTHORS TABLE */}
          <table className="table table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Biography</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {authors.map(author => (
                <tr key={author.author_id}>
                  <td>{author.author_id}</td>
                  <td>{author.name}</td>
                  <td>{author.biography || "-"}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => editAuthor(author)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => deleteAuthor(author.author_id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {authors.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center">
                    No authors found
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

export default Authors;
