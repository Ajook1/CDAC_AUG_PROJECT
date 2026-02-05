import { useState } from 'react';
import { addInventory } from '../../api/storeApi';
import { toast } from 'react-toastify';

const AddCustomBookForm = ({ storeId }) => {
    const [form, setForm] = useState({
        title: '',
        price: '',
        stock_quantity: ''
    });

    const submit = async (e) => {
        e.preventDefault();

        await addInventory({
            store_id: storeId,
            new_book: { title: form.title },
            price: form.price,
            stock_quantity: form.stock_quantity
        });

        toast.success('Custom book added successfully');
    };

    return (
        <form onSubmit={submit} className="card p-3">
            <input
                className="form-control mb-2"
                placeholder="Book Title"
                required
                onChange={(e) => setForm({ ...form, title: e.target.value })}
            />

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

            <button className="btn btn-success">Add Custom Book</button>
        </form>
    );
};

export default AddCustomBookForm;
