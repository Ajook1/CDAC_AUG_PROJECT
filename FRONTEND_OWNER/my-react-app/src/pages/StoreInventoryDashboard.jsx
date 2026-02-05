import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { getOwnerStores, getOwnerInventory } from '../api/storeApi';

const StoreInventoryDashboard = () => {
    const [stores, setStores] = useState([]);
    const [inventory, setInventory] = useState([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const st = await getOwnerStores();
        const inv = await getOwnerInventory();

        setStores(st.data.data);
        setInventory(inv.data.data);
    };

    const countByStore = (store_id) =>
        inventory.filter(i => i.store_id === store_id).length;

    return (
        <Navbar>
            <div className="container">
                <h4 className="mb-4">Store Inventory Overview</h4>

                <div className="row g-3">
                    {stores.map(store => (
                        <div
                            key={store.store_id}
                            className="col-md-4"
                        >
                            <div className="card shadow-sm p-3">
                                <h6>{store.store_name}</h6>
                                <p className="mb-1">
                                    Total Books: <b>{countByStore(store.store_id)}</b>
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Navbar>
    );
};

export default StoreInventoryDashboard;
