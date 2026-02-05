import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import {
    getOwnerStores,
    updateStoreStatus
} from '../api/storeApi';

const Stores = () => {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load owner stores
    useEffect(() => {
        loadStores();
    }, []);

    const loadStores = async () => {
    try {
        const res = await getOwnerStores();

        if (res.data && res.data.data) {
            setStores(res.data.data);
        } else {
            setStores([]);
        }

    } catch (err) {
        console.error('Failed to load stores', err);
        setStores([]);
    } finally {
        setLoading(false);
    }
};


    // Activate / Deactivate store
    const toggleStatus = async (store) => {
        try {
            await updateStoreStatus(store.store_id, !store.is_active);
            loadStores();
        } catch (err) {
            console.error('Failed to update store status', err);
        }
    };

    return (
        <Navbar>
            <div className="container-fluid px-4">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center my-3">
                    <h4 className="fw-bold mb-0">My Stores</h4>

                    <Link to="/stores/create" className="btn btn-primary">
                        + Create Store
                    </Link>
                </div>

                {/* Loading State */}
                {loading && (
                    <p className="text-muted">Loading stores...</p>
                )}

                {/* Store Cards */}
                <div className="row g-4">
                    {!loading &&
                        stores.map((store) => (
                            <div
                                className="col-12 col-sm-6 col-lg-4"
                                key={store.store_id}
                            >
                                <div
                                    className="card h-100"
                                    style={{
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        boxShadow:
                                            '0 4px 10px rgba(0,0,0,0.08)'
                                    }}
                                >
                                    {/* Store Image */}
                                    <div style={{ overflow: 'hidden' }}>
                                        {/* Store Image with padding */}
                                        <div style={{ padding: '12px' }}>
                                            <div
                                                style={{
                                                    overflow: 'hidden',
                                                    borderRadius: '8px'
                                                }}
                                            >
                                                <img
                                                    src={
                                                        store.store_image
                                                            ? `${import.meta.env.VITE_API_URL}/${store.store_image}`
                                                            : 'https://via.placeholder.com/400x220?text=No+Image'
                                                    }
                                                    alt="Store"
                                                    style={{
                                                        height: '220px',
                                                        width: '100%',
                                                        objectFit: 'cover',
                                                        display: 'block'
                                                    }}
                                                />
                                            </div>
                                        </div>

                                    </div>

                                    {/* Store Info */}
                                    <div className="card-body">
                                        <h5 className="fw-bold mb-1">
                                            {store.store_name}
                                        </h5>

                                        <p className="text-muted mb-2">
                                            {store.city || 'City not specified'}
                                        </p>

                                        <span
                                            className={`badge ${store.is_active
                                                ? 'bg-success'
                                                : 'bg-secondary'
                                                }`}
                                        >
                                            {store.is_active
                                                ? 'Active'
                                                : 'Inactive'}
                                        </span>

                                        {/* Actions */}
                                        <div className="d-flex gap-2 mt-3">
                                            <Link
                                                to={`/stores/edit/${store.store_id}`}
                                                className="btn btn-sm btn-outline-primary"
                                            >
                                                Edit
                                            </Link>

                                            <button
                                                onClick={() =>
                                                    toggleStatus(store)
                                                }
                                                className="btn btn-sm btn-outline-warning"
                                            >
                                                {store.is_active
                                                    ? 'Deactivate'
                                                    : 'Activate'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                    {!loading && stores.length === 0 && (
                        <p className="text-muted">
                            No stores created yet.
                        </p>
                    )}
                </div>
            </div>
        </Navbar>
    );
};

export default Stores;
