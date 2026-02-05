import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getOrderDetails } from '../api/storeApi';
import { toast } from 'react-toastify';

const OrderDetails = () => {
    const { order_id } = useParams();
    const [items, setItems] = useState([]);

    useEffect(() => {
        loadDetails();
    }, []);

    const loadDetails = async () => {
        try {
            const res = await getOrderDetails(order_id);
            setItems(res.data.data || []);
        } catch (err) {
            console.error(err);
            toast.error('Failed to load order details');
        }
    };

    return (
        <Navbar>
            <div className="container">
                <h4 className="mb-3 fw-bold">
                    Order #{order_id} Details
                </h4>

                <div className="card shadow-sm">
                    <div className="table-responsive">
                        <table className="table table-bordered mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>Book</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                    <th>Total</th>
                                </tr>
                            </thead>

                            <tbody>
                                {items.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="text-center text-muted">
                                            No items found
                                        </td>
                                    </tr>
                                )}

                                {items.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.title}</td>
                                        <td>{item.quantity}</td>
                                        <td>₹{item.price}</td>
                                        <td>₹{item.quantity * item.price}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Navbar>
    );
};

export default OrderDetails;
