import { useEffect, useState } from 'react';
import { getAdminBooks, addInventory } from '../../api/storeApi';
import { toast } from 'react-toastify';

const AddAdminBookForm = ({ storeId }) => {
    const [books, setBooks] = useState([]);
    const [form, setForm] = useState({ book_id: '', price: '', stock_quantity: '' });

    useEffect(() => {
        getAdminBooks().then(res => setBooks(res.data.data));
    }, []);

    const submit = async (e) => {
        e.preventDefault();
        await addInventory({ ...form, store_id: storeId });
        toast.success('Admin book added successfully');
    };

    return (
        <form onSubmit={submit} className="card p-3">
            <select
                className="form-select mb-2"
                onChange={(e) => setForm({ ...form, book_id: e.target.value })}
                required
            >
                <option value="">Select Admin Book</option>
                {books.map(b => (
                    <option key={b.book_id} value={b.book_id}>
                        {b.title}
                    </option>
                ))}
            </select>

            <input
                className="form-control mb-2"
                placeholder="Price"
                type="number"
                required
                onChange={(e) => setForm({ ...form, price: e.target.value })}
            />

            <input
                className="form-control mb-2"
                placeholder="Stock Quantity"
                type="number"
                required
                onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })}
            />

            <button className="btn btn-primary">Add Book</button>
        </form>
    );
};

export default AddAdminBookForm;
