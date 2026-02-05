import { useEffect, useState } from 'react';
import {
    getTotalOrders,
    getTotalSales,
    getLowStock
} from '../api/storeApi';
import Navbar from '../components/Navbar';

const Dashboard = () => {
    const [orders, setOrders] = useState(0);
    const [sales, setSales] = useState(0);
    const [lowStock, setLowStock] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const [o, s, l] = await Promise.all([
                    getTotalOrders(),
                    getTotalSales(),
                    getLowStock()
                ]);

                setOrders(o.data.data.total_orders);
                setSales(s.data.data.total_sales);
                setLowStock(l.data.data.low_stock_count);
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    if (loading) {
        return (
            <Navbar>
                <div className="container mt-4">Loading dashboard...</div>
            </Navbar>
        );
    }

    return (
        <Navbar>
            <div className="container-fluid px-4 mt-4">
                <h4 className="mb-4 fw-semibold">Dashboard Overview</h4>

                <div className="row g-4">
                    {/* Orders */}
                    <div className="col-12 col-md-4">
                        <div className="card shadow-sm border-0 h-100">
                            <div className="card-body">
                                <p className="text-muted mb-1">Total Orders</p>
                                <h2 className="fw-bold text-primary">{orders}</h2>
                            </div>
                        </div>
                    </div>

                    {/* Sales */}
                    <div className="col-12 col-md-4">
                        <div className="card shadow-sm border-0 h-100">
                            <div className="card-body">
                                <p className="text-muted mb-1">Total Sales</p>
                                <h2 className="fw-bold text-success">
                                    ₹{Number(sales).toLocaleString()}
                                </h2>
                            </div>
                        </div>
                    </div>

                    {/* Low Stock */}
                    <div className="col-12 col-md-4">
                        <div className="card shadow-sm border-0 h-100">
                            <div className="card-body">
                                <p className="text-muted mb-1">Low Stock Items</p>
                                <h2 className={`fw-bold ${lowStock > 0 ? 'text-danger' : 'text-success'}`}>
                                    {lowStock}
                                </h2>
                                <small className="text-muted">
                                    Stock below threshold
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Navbar>
    );
};

export default Dashboard;
