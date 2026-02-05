import { useEffect, useState } from "react";
import Navbar from "../component/Navbar";
import Sidebar from "../component/Sidebar";
import adminApi from "../api/adminApi";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [showDisabled, setShowDisabled] = useState(false);

  const [editBookId, setEditBookId] = useState(null);
  const [selectedInventory, setSelectedInventory] = useState(null);

  const [showForm, setShowForm] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [categories, setCategories] = useState([]);
  const [stores, setStores] = useState([]);
  const [storeId, setStoreId] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    isbn: "",
    author_id: "",
    publisher_id: "",
    category_id: "",
    language: "",
    pages: "",
    publication_date: "",
    price: "",
    mrp: "",
    stock_quantity: ""
  });

  const [coverImage, setCoverImage] = useState(null);

  /* ================= LOAD CATEGORIES ================= */
  const loadCategories = () => {
    adminApi.get("/categories").then(res => {
      setCategories(res.data.data || []);
    });
  };

  /* ================= LOAD BOOKS ================= */
  const loadBooks = () => {
    const params = {};
    if (!showDisabled) params.status = "active";
    if (selectedCategory) params.category = selectedCategory;

    adminApi.get("/books/all", { params }).then(res => {
      setBooks(res.data.data || []);
    });
  };

  useEffect(() => {
    loadCategories();
    loadBooks();

    adminApi.get("/books/stores").then(res => {
      setStores(res.data.data || []);
    });

  }, [showDisabled]);


  /* ================= SEARCH FILTER ================= */
  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* ================= FORM HELPERS ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
  setEditBookId(null);
  setShowForm(false);
  setFormData({
    title: "",
    description: "",
    isbn: "",
    author_id: "",
    publisher_id: "",
    category_id: "",
    language: "",
    pages: "",
    publication_date: "",
    price: "",
    mrp: "",
    stock_quantity: ""
  });
  setCoverImage(null);

  setStoreId("");   // ✅ ADD THIS LINE HERE
};


  /* ================= ADD BOOK ================= */
  const handleAddBook = (e) => {
  e.preventDefault();

  if (!coverImage) {
    alert("Cover image required");
    return;
  }

  if (!storeId) {
    alert("Please select store");
    return;
  }

  const fd = new FormData();
  Object.keys(formData).forEach(k => fd.append(k, formData[k]));
  fd.append("cover", coverImage);
  fd.append("store_id", storeId);   // ✅ IMPORTANT

  adminApi.post("/books", fd).then(() => {
    resetForm();
    loadBooks();
  });
};


  /* ================= EDIT INVENTORY ================= */
  const editBook = (book) => {
    setShowForm(true);
    console.log("EDIT BOOK DATA:", book);

    setEditBookId(book.inventory_id);
    setSelectedInventory(book);

    setFormData({
      price: book.price,
      mrp: book.mrp,
      stock_quantity: book.stock_quantity,  // ✅ REAL VALUE FROM DB
    });
  };


  const handleEditBook = (e) => {
    e.preventDefault();

    adminApi.put("/books/update-inventory", {
      inventory_id: editBookId,
      price: formData.price,
      mrp: formData.mrp,
      stock_quantity: formData.stock_quantity
    })
      .then(() => {
        resetForm();
        loadBooks();
      });
  };


  /* ================= ENABLE / DISABLE ================= */
  const disableBook = (id) => {
    if (!window.confirm("Disable this book?")) return;
    adminApi.put("/books/disable", { book_id: id }).then(loadBooks);
  };

  const enableBook = (id) => {
    if (!window.confirm("Enable this book?")) return;
    adminApi.put("/books/enable", { book_id: id }).then(loadBooks);
  };

  /* ================= UI ================= */
  return (
    <>
      <Navbar />

      <div className="d-flex">
        <Sidebar />

        <div className="container-fluid p-4">

          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3>Books Management</h3>

            <div>
              <button
                className="btn btn-secondary me-2"
                onClick={() => setShowDisabled(!showDisabled)}
              >
                {showDisabled ? "Show Active Books" : "Show Disabled Books"}
              </button>

              <button
                className="btn btn-primary"
                onClick={() => {
                  resetForm();
                  setShowForm(true);
                }}
              >
                + Add Book
              </button>
            </div>
          </div>

          {/* 🔍 SEARCH + CATEGORY FILTER */}
          <div className="row mb-3">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Search by book title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="col-md-4">

              <select
                className="form-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(c => (
                  <option key={c.category_id} value={c.category_name}>
                    {c.category_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-2">
              <button className="btn btn-dark w-100" onClick={loadBooks}>
                Apply
              </button>
            </div>
          </div>


          {/* ================= ADD / EDIT FORM ================= */}
          {showForm && (
            <form
              className="card p-3 mb-4"
              onSubmit={editBookId ? handleEditBook : handleAddBook}
            >
              <h5>{editBookId ? "Update Inventory" : "Add Book"}</h5>

              {editBookId && selectedInventory && (
                <div className="mb-2">
                  <label className="form-label">Store</label>
                  <input
                    className="form-control"
                    value={selectedInventory.stock_details}
                    disabled
                  />
                </div>
              )}


              {!editBookId && (
                <>
                  <input
                    className="form-control mb-2"
                    name="title"
                    placeholder="Title"
                    onChange={handleChange}
                    required
                  />
                  <textarea
                    className="form-control mb-2"
                    name="description"
                    placeholder="Description"
                    onChange={handleChange}
                  />
                  <input
                    className="form-control mb-2"
                    name="isbn"
                    placeholder="ISBN"
                    onChange={handleChange}
                  />
                  <input
                    className="form-control mb-2"
                    name="author_id"
                    placeholder="Author ID"
                    onChange={handleChange}
                    required
                  />
                  <input
                    className="form-control mb-2"
                    name="publisher_id"
                    placeholder="Publisher ID"
                    onChange={handleChange}
                    required
                  />
                  <input
                    className="form-control mb-2"
                    name="category_id"
                    placeholder="Category ID"
                    onChange={handleChange}
                    required
                  />
                  <input
                    className="form-control mb-2"
                    name="language"
                    placeholder="Language"
                    onChange={handleChange}
                  />
                  <input
                    className="form-control mb-2"
                    name="pages"
                    type="number"
                    placeholder="Pages"
                    onChange={handleChange}
                  />
                  <input
                    className="form-control mb-2"
                    name="publication_date"
                    type="date"
                    onChange={handleChange}
                  />
                  <select
                    className="form-control mb-2"
                    value={storeId}
                    onChange={(e) => setStoreId(e.target.value)}
                    required
                  >
                    <option value="">Select Store</option>
                    {stores.map(s => (
                      <option key={s.store_id} value={s.store_id}>
                        {s.store_name}
                      </option>
                    ))}
                  </select>

                </>
              )}

              <input
                className="form-control mb-2"
                name="price"
                type="number"
                placeholder="Price"
                onChange={handleChange}
                required
              />
              <input
                className="form-control mb-2"
                name="mrp"
                type="number"
                placeholder="MRP"
                onChange={handleChange}
                required
              />
              <input
                className="form-control mb-2"
                name="stock_quantity"
                type="number"
                placeholder="Stock Quantity"
                onChange={handleChange}
                required
              />

              {!editBookId && (
                <input
                  type="file"
                  className="form-control mb-2"
                  onChange={(e) => setCoverImage(e.target.files[0])}
                  required
                />
              )}

              <button className="btn btn-success me-2">
                {editBookId ? "Update" : "Save"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={resetForm}
              >
                Cancel
              </button>
            </form>
          )}


          {/* ================= BOOKS TABLE ================= */}
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>Cover</th>
                <th>Title</th>
                <th>Author</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
                <th>More Info</th>
              </tr>
            </thead>

            <tbody>
              {filteredBooks.map(book => (
                <tr key={book.inventory_id}>
                  <td>
                    <img
                      src={`${import.meta.env.VITE_API_URL}/${book.cover_image_url}`}
                      style={{ width: 50 }}
                      alt=""
                    />
                  </td>
                  <td>{book.title}</td>
                  <td>{book.author_name}</td>
                  <td>{book.category_name}</td>
                  <td>₹ {book.price}</td>
                  <td>{book.stock_details}</td>

                  <td>
                    {book.is_active === 1 ? (
                      <>
                        <button
                          className="btn btn-sm btn-warning me-2"
                          onClick={() => editBook(book)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => disableBook(book.book_id)}
                        >
                          Disable
                        </button>
                      </>
                    ) : (
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => enableBook(book.book_id)}
                      >
                        Enable
                      </button>
                    )}
                  </td>

                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => {
                        setSelectedBook(book);
                        setShowModal(true);
                      }}
                    >
                      More Info
                    </button>
                  </td>
                </tr>
              ))}

              {filteredBooks.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center">
                    No books found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

        </div>
      </div>

      {/* ================= MORE INFO MODAL ================= */}
      {showModal && selectedBook && (
        <>
          <div className="modal fade show d-block">
            <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
              <div className="modal-content">

                <div className="modal-header">
                  <h5 className="modal-title">Book Details</h5>
                  <button className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>

                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-4 text-center">
                      <img
                        src={`${import.meta.env.VITE_API_URL}/bookcovers/${selectedBook.cover_image_url}`}
                        className="img-fluid rounded shadow"
                        style={{ maxHeight: "260px" }}
                        alt=""
                      />
                    </div>

                    <div className="col-md-8">
                      <h5>{selectedBook.title}</h5>
                      <p className="text-muted">{selectedBook.description}</p>

                      <table className="table table-sm">
                        <tbody>
                          <tr><th>Book ID</th><td>{selectedBook.book_id}</td></tr>
                          <tr><th>Author</th><td>{selectedBook.author_name}</td></tr>
                          <tr><th>Publisher</th><td>{selectedBook.publisher_name}</td></tr>
                          <tr><th>Category</th><td>{selectedBook.category_name}</td></tr>
                          <tr><th>ISBN</th><td>{selectedBook.isbn}</td></tr>
                          <tr><th>Language</th><td>{selectedBook.language}</td></tr>
                          <tr><th>Pages</th><td>{selectedBook.pages}</td></tr>
                          <tr><th>Publication Date</th><td>{selectedBook.publication_date}</td></tr>
                          <tr><th>Price</th><td>₹ {selectedBook.price}</td></tr>
                          <tr><th>MRP</th><td>₹ {selectedBook.mrp}</td></tr>
                          <tr><th>Stock</th><td>{selectedBook.stock_details}</td></tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Close
                  </button>
                </div>

              </div>
            </div>
          </div>

          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </>
  );
};

export default Books;
