import { useEffect, useState } from 'react';
import { getOwnerStores } from '../../api/storeApi';

const StoreSelector = ({ onSelect }) => {
    const [stores, setStores] = useState([]);

    useEffect(() => {
        getOwnerStores().then(res => setStores(res.data.data));
    }, []);

    return (
        <select
            className="form-select"
            onChange={(e) => onSelect(e.target.value)}
        >
            <option value="">Select Store</option>
            {stores.map(s => (
                <option key={s.store_id} value={s.store_id}>
                    {s.store_name}
                </option>
            ))}
        </select>
    );
};

export default StoreSelector;
