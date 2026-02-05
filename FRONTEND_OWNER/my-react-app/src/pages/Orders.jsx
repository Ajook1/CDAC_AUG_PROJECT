import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { getOwnerOrders, cancelOrder } from '../api/storeApi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        loadOrders();
    }, []);

   const loadOrders = async () => {
    try {
        const res = await getOwnerOrders();
        setOrders(res.data?.data || []);
    } catch (err) {
        console.error(err);
        setOrders([]);
    }
};


    const handleCancel = async (order_id) => {
        if (!window.confirm('Cancel this order?')) return;

        try {
            await cancelOrder(order_id);
            toast.success('Order cancelled');
            loadOrders();
        } catch (err) {
            console.error(err);
            toast.error('Failed to cancel order');
        }
    };

    return (
        <Navbar>
            <div className="container">
                <h4 className="mb-3 fw-bold">Customer Orders</h4>

                <div className="card shadow-sm">
                    <div className="table-responsive">
                        <table className="table table-bordered mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>Order ID</th>
                                    <th>Date</th>
                                    <th>Customer</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th style={{ width: '220px' }}>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {orders.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="text-center text-muted">
                                            No orders found
                                        </td>
                                    </tr>
                                )}

                                {orders.map(order => (
                                    <tr key={order.order_id}>
                                        <td>#{order.order_id}</td>
                                        <td>
                                            {new Date(order.order_date).toLocaleString()}
                                        </td>
                                        <td>{order.customer_name}</td>
                                        <td>₹{order.total_amount}</td>
                                        <td>
                                            <span className={`badge ${order.status === 'Cancelled'
                                                    ? 'bg-danger'
                                                    : 'bg-success'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                <button
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={() =>
                                                        navigate(`/orders/${order.order_id}`)
                                                    }
                                                >
                                                    View
                                                </button>

                                                {order.status !== 'Cancelled' && (
                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() =>
                                                            handleCancel(order.order_id)
                                                        }
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
                                            </div>
                                        </td>
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

export default Orders;
