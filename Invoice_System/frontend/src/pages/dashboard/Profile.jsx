import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';

const Profile = () => {
    const [user, setUser] = useState({});
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [logoFile, setLogoFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const navigate = useNavigate();

    const getProfile = async () => {
        try {
            const res = await API.get('/users/getUserDetail');
            setUser(res.data.data);
        } catch {
            setError('Failed to load user data.');
        }
    };

    const handleLogoUpload = async () => {
        setError('');
        setMessage('');
        if (!logoFile) return;

        try {
            setUploading(true);
            const formData = new FormData();
            formData.append('companyLogo', logoFile);
            formData.append('previousFile', user.logo?.split('/').pop() || '');

            const logoRes = await API.post('/users/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (logoRes.data?.data?.logo) {
                const updatedUser = { ...user, logo: logoRes.data.data.logo };
                setUser(updatedUser);
                setMessage('Profile picture updated successfully.');
            }
        } catch (err) {
            setError('Logo upload failed.');
        } finally {
            setUploading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (!user.name || !user.email) {
            setError('Name and Email are required.');
            return;
        }

        try {
            const res = await API.put('/users/updateUserDetail', user);
            setMessage('Profile updated successfully.');
            localStorage.setItem('user', JSON.stringify(res.data));
        } catch (err) {
            setError(err?.response?.data?.message || 'Update failed.');
        }
    };

    useEffect(() => {
        getProfile();
    }, []);

    return (
        <div className="max-w-xl mx-auto bg-white p-6 rounded shadow relative">
            <button
                onClick={() => navigate(-1)}
                className="absolute left-4 top-4 text-gray-600 hover:text-black"
            >
                ← Back
            </button>

            <h2 className="text-xl font-bold mb-6 text-center">👤 Edit Profile</h2>

            {error && <div className="text-red-600 mb-2 text-sm bg-red-100 px-4 py-2 rounded">{error}</div>}
            {message && <div className="text-green-600 mb-2 text-sm bg-green-100 px-4 py-2 rounded">{message}</div>}

            <form onSubmit={handleUpdate} className="space-y-4">
                <div className="flex flex-col items-center">
                    {user.logo ? (
                        <img
                            src={user.logo}
                            alt="User Logo"
                            className="w-24 h-24 rounded-full object-cover border mb-2"
                        />

                    ) : (
                        <div className="w-24 h-24 flex items-center justify-center rounded-full bg-purple-500 text-white text-2xl font-bold mb-2">
                            {user.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                    )}

                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setLogoFile(e.target.files[0])}
                        className="text-sm"
                    />

                    <button
                        type="button"
                        onClick={handleLogoUpload}
                        disabled={!logoFile || uploading}
                        className="mt-2 text-sm text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
                    >
                        {uploading ? 'Uploading...' : 'Upload Profile Picture'}
                    </button>
                </div>

                <div>
                    <label className="block mb-1 text-sm">Full Name</label>
                    <input
                        type="text"
                        className="w-full border px-3 py-2 rounded"
                        placeholder="Full Name"
                        value={user.name || ''}
                        onChange={(e) => setUser({ ...user, name: e.target.value })}
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm">Email (cannot change)</label>
                    <input
                        type="email"
                        className="w-full border px-3 py-2 rounded bg-gray-100"
                        value={user.email || ''}
                        disabled
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm">Phone</label>
                    <input
                        type="text"
                        className="w-full border px-3 py-2 rounded"
                        placeholder="Phone number"
                        value={user.phone || ''}
                        onChange={(e) => setUser({ ...user, phone: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm">Company</label>
                    <input
                        type="text"
                        className="w-full border px-3 py-2 rounded"
                        placeholder="Company Name"
                        value={user.companyName || ''}
                        onChange={(e) => setUser({ ...user, companyName: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm">Address</label>
                    <input
                        type="text"
                        className="w-full border px-3 py-2 rounded"
                        placeholder="Address"
                        value={user.address || ''}
                        onChange={(e) => setUser({ ...user, address: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm">City</label>
                    <input
                        type="text"
                        className="w-full border px-3 py-2 rounded"
                        placeholder="City"
                        value={user.city || ''}
                        onChange={(e) => setUser({ ...user, city: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm">Zip Code</label>
                    <input
                        type="text"
                        className="w-full border px-3 py-2 rounded"
                        placeholder="Zip Code"
                        value={user.zipCode || ''}
                        onChange={(e) => setUser({ ...user, zipCode: e.target.value })}
                    />
                </div>

                <button
                    type="submit"
                    className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 w-full"
                >
                    Update Profile
                </button>
            </form>
        </div>
    );
};

export default Profile;
