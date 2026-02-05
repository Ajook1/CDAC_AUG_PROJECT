import { useState } from 'react';
import Navbar from '../components/Navbar';
import { changeOwnerPassword } from '../api/storeApi';
import { toast } from 'react-toastify';

const ChangePassword = () => {
    const [data, setData] = useState({
        oldPassword: '',
        newPassword: ''
    });

    const submit = async () => {
        await changeOwnerPassword(data);
        toast.success('Password updated successfully');
        setData({ oldPassword: '', newPassword: '' });
    };

    return (
        <Navbar>
            <div className="container">
                <h4 className="mb-3">Change Password</h4>

                <input
                    type="password"
                    className="form-control mb-2"
                    placeholder="Old Password"
                    value={data.oldPassword}
                    onChange={(e) =>
                        setData({ ...data, oldPassword: e.target.value })
                    }
                />

                <input
                    type="password"
                    className="form-control mb-3"
                    placeholder="New Password"
                    value={data.newPassword}
                    onChange={(e) =>
                        setData({ ...data, newPassword: e.target.value })
                    }
                />

                <button className="btn btn-warning" onClick={submit}>
                    Update Password
                </button>
            </div>
        </Navbar>
    );
};

export default ChangePassword;
