import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { updateInventory } from '../api/storeApi';
import { toast } from 'react-toastify';

const EditInventory = () => {
    const { inventory_id } = useParams();
    const navigate = useNavigate();

    const [data, setData] = useState({
        price: '',
        mrp: '',
        stock_quantity: ''
    });

    const save = async () => {
        try {
            const res = await updateInventory(inventory_id, data);

            if (res.data?.error) {
                toast.error(res.data.error);
                return;
            }

            toast.success('Inventory updated successfully');
            navigate('/inventory');
        } catch (err) {
            console.error(err);
            toast.error('Failed to update inventory');
        }
    };

    return (
        <Navbar>
            <div className="container px-4">
                <h4 className="my-3">Edit Inventory</h4>

                <input
                    type="number"
                    className="form-control mb-2"
                    placeholder="Price"
                    value={data.price}
                    onChange={(e) =>
                        setData({ ...data, price: e.target.value })
                    }
                />

                <input
                    type="number"
                    className="form-control mb-2"
                    placeholder="MRP"
                    value={data.mrp}
                    onChange={(e) =>
                        setData({ ...data, mrp: e.target.value })
                    }
                />

                <input
                    type="number"
                    className="form-control mb-3"
                    placeholder="Stock Quantity"
                    value={data.stock_quantity}
                    onChange={(e) =>
                        setData({ ...data, stock_quantity: e.target.value })
                    }
                />

                <button
                    type="button"
                    className="btn btn-success"
                    onClick={save}
                >
                    Save Changes
                </button>
            </div>
        </Navbar>
    );
};

export default EditInventory;
