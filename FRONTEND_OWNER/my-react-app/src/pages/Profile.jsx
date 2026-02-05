import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { getOwnerProfile, updateOwnerProfile } from '../api/storeApi';
import { toast } from 'react-toastify';

const Profile = () => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: ''
    });

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const res = await getOwnerProfile();
            setForm(res.data.data);
        } catch {
            toast.error('Failed to load profile');
        }
    };

    const save = async () => {
        // 🔒 CLIENT SIDE VALIDATION
        if (form.phone) {
            if (!/^[0-9]+$/.test(form.phone)) {
                toast.warn('📵 Phone number must contain only digits');
                return;
            }

            if (form.phone.length !== 10) {
                toast.warn('📏 Phone number must be exactly 10 digits');
                return;
            }
        }

        try {
            const res = await updateOwnerProfile({
                name: form.name,
                phone: form.phone
            });

            if (res.data?.error) {
                toast.error(`❌ ${res.data.error}`);
                return;
            }

            toast.success('Profile updated successfully');
        } catch {
            toast.error('Something went wrong while updating profile');
        }
    };

    return (
        <Navbar>
            <div className="container">
                <h4 className="mb-3 fw-bold">My Profile</h4>

                <div className="card shadow-sm p-4" style={{ maxWidth: '480px' }}>
                    <label className="form-label">Name</label>
                    <input
                        className="form-control mb-3"
                        value={form.name}
                        onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                        }
                        placeholder="Your Name"
                    />

                    <label className="form-label">Email</label>
                    <input
                        className="form-control mb-3"
                        value={form.email}
                        disabled
                    />

                    <label className="form-label">Phone</label>
                    <input
                        className="form-control mb-4"
                        value={form.phone || ''}
                        maxLength={10}
                        onChange={(e) =>
                            setForm({ ...form, phone: e.target.value })
                        }
                        placeholder="10-digit phone number"
                    />

                    <button className="btn btn-primary w-100" onClick={save}>
                        Update Profile
                    </button>
                </div>
            </div>
        </Navbar>
    );
};

export default Profile;
