import { useEffect, useState } from "react";
import Navbar from "../component/Navbar";
import Sidebar from "../component/Sidebar";
import adminApi from "../api/adminApi";

const Categories = () => {
  const [categories, setCategories] = useState([]);

  // CRUD state
  const [showForm, setShowForm] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState(null);

  // FORM STATE
  const [formData, setFormData] = useState({
    category_name: ""
  });

  /* ================= LOAD CATEGORIES ================= */

  const loadCategories = () => {
    adminApi.get("/categories").then(res => {
      if (res.data && res.data.data) {
        setCategories(res.data.data);
      }
    });
  };

  useEffect(() => {
    loadCategories();
  }, []);

  /* ================= FORM HANDLERS ================= */

  const handleChange = (e) => {
    setFormData({ category_name: e.target.value });
  };

  const resetForm = () => {
    setEditCategoryId(null);
    setFormData({ category_name: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const apiCall = editCategoryId
      ? adminApi.put("/categories", {
          category_id: editCategoryId,
          category_name: formData.category_name
        })
      : adminApi.post("/categories", formData);

    apiCall.then(() => {
      resetForm();
      setShowForm(false);
      loadCategories();
    });
  };

  /* ================= EDIT ================= */

  const editCategory = (category) => {
    setEditCategoryId(category.category_id);
    setFormData({ category_name: category.category_name });
    setShowForm(true);
  };

  /* ================= DELETE ================= */

  const deleteCategory = (categoryId) => {
    if (!window.confirm("Delete this category?")) return;

    adminApi.delete("/categories", {
      data: { category_id: categoryId }
    }).then(() => loadCategories());
  };

  /* ================= UI ================= */

  return (
    <>
      <Navbar />

      <div className="d-flex">
        <Sidebar />

        <div className="container-fluid p-4">
          <h3 className="mb-3">Categories Management</h3>

          {/* ADD CATEGORY */}
          <button
            className="btn btn-primary mb-3"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
          >
            + Add Category
          </button>

          {/* ADD / EDIT FORM */}
          {showForm && (
            <form className="card p-3 mb-4" onSubmit={handleSubmit}>
              <h5>{editCategoryId ? "Edit Category" : "Add Category"}</h5>

              <input
                type="text"
                className="form-control mb-2"
                placeholder="Category Name"
                value={formData.category_name}
                onChange={handleChange}
                required
              />

              <div className="d-flex gap-2">
                <button className="btn btn-success" type="submit">
                  {editCategoryId ? "Update Category" : "Save Category"}
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

          {/* CATEGORIES TABLE */}
          <table className="table table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Category Name</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {categories.map(category => (
                <tr key={category.category_id}>
                  <td>{category.category_id}</td>
                  <td>{category.category_name}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => editCategory(category)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => deleteCategory(category.category_id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {categories.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center">
                    No categories found
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

export default Categories;
