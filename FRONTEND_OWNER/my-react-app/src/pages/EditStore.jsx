import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import {
    getStoreById,
    updateStore,
    uploadStoreImage
} from '../api/storeApi';

const EditStore = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // ⭐ NEW: full store state
    const [store, setStore] = useState({});
    const [image, setImage] = useState(null);

    // Load store details
    useEffect(() => {
        loadStore();
    }, []);

    const loadStore = async () => {
        const res = await getStoreById(id);
        setStore(res.data.data);
    };

    // ⭐ NEW: handle input changes
    const handleChange = (e) => {
        setStore({
            ...store,
            [e.target.name]: e.target.value
        });
    };

    // Update store
    const handleUpdate = async (e) => {
        e.preventDefault();
        await updateStore(id, store);
        navigate('/stores');
    };

    // Upload image
    const handleImageUpload = async () => {
        if (!image) return;
        await uploadStoreImage(id, image);
        alert('Image uploaded successfully');
        loadStore(); // ⭐ NEW: refresh image
    };

    return (
        <Navbar>
            <div className="container mt-4">
                <h4>Edit Store</h4>

                {/* ================= STORE FORM ================= */}
                <form className="row g-3" onSubmit={handleUpdate}>
                    <div className="col-md-6">
                        <input
                            className="form-control"
                            name="store_name"
                            placeholder="Store Name"
                            value={store.store_name || ''}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="col-md-6">
                        <input
                            className="form-control"
                            name="contact_email"
                            placeholder="Contact Email"
                            value={store.contact_email || ''}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-12">
                        <textarea
                            className="form-control"
                            name="description"
                            placeholder="Store Description"
                            value={store.description || ''}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-12">
                        <input
                            className="form-control"
                            name="address_line"
                            placeholder="Address Line"
                            value={store.address_line || ''}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-4">
                        <input
                            className="form-control"
                            name="city"
                            placeholder="City"
                            value={store.city || ''}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-4">
                        <input
                            className="form-control"
                            name="state"
                            placeholder="State"
                            value={store.state || ''}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-4">
                        <input
                            className="form-control"
                            name="postal_code"
                            placeholder="Postal Code"
                            value={store.postal_code || ''}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-6">
                        <input
                            className="form-control"
                            name="country"
                            placeholder="Country"
                            value={store.country || ''}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-6">
                        <input
                            className="form-control"
                            name="contact_phone"
                            placeholder="Contact Phone"
                            value={store.contact_phone || ''}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-12">
                        <button className="btn btn-primary">
                            Update Store
                        </button>
                    </div>
                </form>

                {/* ================= IMAGE UPLOAD ================= */}
                <hr className="my-4" />

                <h6>Store Image</h6>

                {store.extra1 && (
                    <img
                        src={`http://localhost:4000/${store.extra1}`}
                        alt="Store"
                        className="img-thumbnail mb-2"
                        style={{ maxWidth: '250px' }}
                    />
                )}

                <input
                    type="file"
                    className="form-control w-50"
                    onChange={(e) => setImage(e.target.files[0])}
                />

                <button
                    className="btn btn-outline-secondary mt-2"
                    onClick={handleImageUpload}
                >
                    Upload Image
                </button>
            </div>
        </Navbar>
    );
};

export default EditStore;
