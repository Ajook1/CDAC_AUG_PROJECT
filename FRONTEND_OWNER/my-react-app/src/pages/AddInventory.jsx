import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import {
    getOwnerStores,
    addInventory,
    getAdminBooks
} from '../api/storeApi';
import { toast } from 'react-toastify';

const AddInventory = () => {
    const navigate = useNavigate();
    const [params] = useSearchParams();

    const preselectedStore = params.get('store_id');

    const [stores, setStores] = useState([]);
    const [adminBooks, setAdminBooks] = useState([]);
    const [storeId, setStoreId] = useState('');
    const [mode, setMode] = useState(''); // admin | custom
    const [coverImage, setCoverImage] = useState(null);

    const [form, setForm] = useState({
        book_id: '',
        title: '',
        isbn: '',
        language: '',
        edition: '',
        published_year: '',
        description: '',
        price: '',
        mrp: '',
        stock_quantity: ''
    });

    /* ---------------- LOAD DATA ---------------- */

    useEffect(() => {
        loadStores();
        loadAdminBooks();
    }, []);

    useEffect(() => {
        if (preselectedStore) {
            setStoreId(preselectedStore);
        }
    }, [preselectedStore]);

    const loadStores = async () => {
        const res = await getOwnerStores();
        setStores(res.data.data || []);
    };

    const loadAdminBooks = async () => {
        const res = await getAdminBooks();
        setAdminBooks(res.data.data || []);
    };

    /* ---------------- HANDLERS ---------------- */

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    /* ---------------- SUBMIT ADMIN BOOK ---------------- */

    const submitAdminBook = async (e) => {
        e.preventDefault();

        if (!form.book_id) {
            toast.error('Please select an admin book');
            return;
        }

        const formData = new FormData();
        formData.append('store_id', storeId);
        formData.append('book_id', form.book_id);
        formData.append('price', form.price);
        formData.append('mrp', form.mrp);
        formData.append('stock_quantity', form.stock_quantity);

        try {
            const res = await addInventory(formData);

            if (res.data?.error) {
                toast.error(res.data.error);
                return;
            }

            toast.success('Admin book added successfully');
            navigate('/inventory');
        } catch {
            toast.error('Failed to add admin book');
        }
    };

    /* ---------------- SUBMIT CUSTOM BOOK ---------------- */

    const submitCustomBook = async (e) => {
        e.preventDefault();

        if (!form.title) {
            toast.error('Book title is required');
            return;
        }

        const formData = new FormData();
        formData.append('store_id', storeId);
        formData.append('price', form.price);
        formData.append('mrp', form.mrp);
        formData.append('stock_quantity', form.stock_quantity);

        // ✅ ONLY DB-SUPPORTED FIELDS
        formData.append('new_book[title]', form.title);
        formData.append('new_book[isbn]', form.isbn);
        formData.append('new_book[language]', form.language);
        // formData.append('new_book[edition]', form.edition);
        // formData.append('new_book[published_year]', form.published_year);
        formData.append('new_book[description]', form.description);

        if (coverImage) {
            formData.append('cover_image', coverImage);
        }

        try {
            const res = await addInventory(formData);

            if (res.data?.error) {
                toast.error(res.data.error);
                return;
            }

            toast.success('Custom book added successfully');
            navigate('/inventory');
        } catch {
            toast.error('Failed to add custom book');
        }
    };

    /* ---------------- UI ---------------- */

    return (
        <Navbar>
            <div className="container">
                <h4 className="mb-3">Add Book to Store</h4>

                {/* STORE */}
                <div className="mb-3">
                    <label className="form-label">Select Store</label>
                    <select
                        className="form-select"
                        value={storeId}
                        onChange={(e) => {
                            setStoreId(e.target.value);
                            setMode('');
                        }}
                        required
                    >
                        <option value="">-- Select Store --</option>
                        {stores.map(store => (
                            <option key={store.store_id} value={store.store_id}>
                                {store.store_name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* MODE */}
                {storeId && (
                    <div className="mb-4">
                        <button
                            className={`btn me-2 ${mode === 'admin' ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => setMode('admin')}
                            type="button"
                        >
                            Add Admin Book
                        </button>

                        <button
                            className={`btn ${mode === 'custom' ? 'btn-success' : 'btn-outline-success'}`}
                            onClick={() => setMode('custom')}
                            type="button"
                        >
                            Add Custom Book
                        </button>
                    </div>
                )}

                {/* ADMIN BOOK */}
                {mode === 'admin' && (
                    <form onSubmit={submitAdminBook} className="card p-4 shadow-sm">
                        <h6 className="mb-3">Admin Book</h6>

                        <select
                            className="form-select mb-3"
                            name="book_id"
                            required
                            onChange={handleChange}
                        >
                            <option value="">Select Admin Book</option>
                            {adminBooks.map(book => (
                                <option key={book.book_id} value={book.book_id}>
                                    {book.title}
                                </option>
                            ))}
                        </select>

                        <input className="form-control mb-2" name="price" placeholder="Price" onChange={handleChange} />
                        <input className="form-control mb-2" name="mrp" placeholder="MRP" onChange={handleChange} />
                        <input className="form-control mb-3" name="stock_quantity" placeholder="Stock Quantity" onChange={handleChange} />

                        <button className="btn btn-primary">Add Book</button>
                    </form>
                )}

                {/* CUSTOM BOOK */}
                {mode === 'custom' && (
                    <form onSubmit={submitCustomBook} className="card p-4 shadow-sm">
                        <h6 className="mb-3">Custom Book</h6>

                        <input className="form-control mb-2" name="title" placeholder="Title" onChange={handleChange} />
                        <input className="form-control mb-2" name="isbn" placeholder="ISBN" onChange={handleChange} />
                        <input className="form-control mb-2" name="language" placeholder="Language" onChange={handleChange} />
                        {/* <input className="form-control mb-2" name="edition" placeholder="Edition" onChange={handleChange} /> */}
                        {/* <input className="form-control mb-2" name="published_year" placeholder="Published Year" onChange={handleChange} /> */}

                        <textarea
                            className="form-control mb-3"
                            name="description"
                            placeholder="Description"
                            onChange={handleChange}
                        />

                        {/* COVER IMAGE */}
                        <input
                            type="file"
                            className="form-control mb-3"
                            accept="image/*"
                            onChange={(e) => setCoverImage(e.target.files[0])}
                        />

                        <input className="form-control mb-2" name="price" placeholder="Price" onChange={handleChange} />
                        <input className="form-control mb-2" name="mrp" placeholder="MRP" onChange={handleChange} />
                        <input className="form-control mb-3" name="stock_quantity" placeholder="Stock Quantity" onChange={handleChange} />

                        <button className="btn btn-success">Add Book</button>
                    </form>
                )}
            </div>
        </Navbar>
    );
};

export default AddInventory;
