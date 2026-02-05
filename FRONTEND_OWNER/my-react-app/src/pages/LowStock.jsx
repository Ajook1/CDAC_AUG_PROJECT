import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { getLowStock } from '../api/storeApi';

const LowStock = () => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        load();
    }, []);

    const load = async () => {
        const res = await getLowStock();
        setItems(res.data.data);
    };

    return (
        <Navbar>
            <div className="container px-4">
                <h4 className="my-3 text-danger">Low Stock Books</h4>

                <ul className="list-group">
                    {items.map((b) => (
                        <li key={b.book_id} className="list-group-item">
                            {b.title} — <strong>{b.stock_quantity}</strong>
                        </li>
                    ))}
                </ul>
            </div>
        </Navbar>
    );
};

export default LowStock;
