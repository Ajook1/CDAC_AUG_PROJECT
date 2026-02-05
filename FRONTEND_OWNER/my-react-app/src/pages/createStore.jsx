import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { createStore } from '../api/storeApi';

const CreateStore = () => {
    const navigate = useNavigate();
    const [store_name, setStoreName] = useState('');
    const [contact_email, setContactEmail] = useState('');

    // ⭐ NEW: Create store handler
    const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const res = await createStore({ store_name, contact_email });

        if (res.data.error) {
            alert(res.data.error);
            return;
        }

        navigate('/stores');
    } catch (err) {
        console.error(err);
        alert('Failed to create store');
    }
};


    return (
        <Navbar>
            <div className="container mt-4">
                <h4>Create Store</h4>

                <form onSubmit={handleSubmit} className="col-md-6">
                    <input
                        className="form-control mb-3"
                        placeholder="Store Name"
                        value={store_name}
                        onChange={(e) => setStoreName(e.target.value)}
                        required
                    />

                    <input
                        className="form-control mb-3"
                        placeholder="Contact Email"
                        value={contact_email}
                        onChange={(e) => setContactEmail(e.target.value)}
                    />

                    <button className="btn btn-primary">
                        Create Store
                    </button>
                </form>
            </div>
        </Navbar>
    );
};

export default CreateStore;
