import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import InventoryTable from '../components/inventory/InventoryTable';
import { getOwnerInventory, getOwnerStores } from '../api/storeApi';
import { Link } from 'react-router-dom';

const Inventory = () => {
    // ✅ MUST BE DEFINED
    const [items, setItems] = useState([]);
    const [stores, setStores] = useState([]);
    const [selectedStore, setSelectedStore] = useState('');

    useEffect(() => {
        loadInventory();
        loadStores();
    }, []);

    const loadInventory = async () => {
        try {
            const res = await getOwnerInventory();
            setItems(res.data.data || []);
        } catch (err) {
            console.error(err);
            setItems([]);
        }
    };

    const loadStores = async () => {
        try {
            const res = await getOwnerStores();
            setStores(res.data.data || []);
        } catch (err) {
            console.error(err);
            setStores([]);
        }
    };

    // ✅ SAFE STORE-WISE FILTER
    const filteredItems =
        selectedStore === '' || selectedStore === 'all'
            ? items
            : items.filter(
                item =>
                    String(item.store_id) === String(selectedStore)
            );


    return (
        <Navbar>
            <div className="container px-4">
                <div className="d-flex justify-content-between align-items-center my-3">
                    <h4 className="fw-bold">Inventory</h4>

                    <div className="d-flex gap-2">
                        {/* STORE FILTER */}
                        <select
                            className="form-select"
                            value={selectedStore}
                            onChange={(e) =>
                                setSelectedStore(e.target.value)
                            }
                        >
                            <option value="">All Stores</option>
                            {stores.map(store => (
                                <option
                                    key={store.store_id}
                                    value={store.store_id}
                                >
                                    {store.store_name}
                                </option>
                            ))}
                        </select>

                        {/* ADD BOOK */}
                        <Link
                            to="/inventory/add"
                            className="btn btn-primary"
                        >
                            + Add Book
                        </Link>
                    </div>
                </div>

                <InventoryTable
                    items={filteredItems}
                    reload={loadInventory}
                />
            </div>
        </Navbar>
    );
};

export default Inventory;
