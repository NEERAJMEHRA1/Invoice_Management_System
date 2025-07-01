import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';

const ResetPassword = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);

    const [status, setStatus] = useState({ message: '', type: '' }); // 🔥 show inside form
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ message: '', type: '' });

        if (!oldPassword || !newPassword) {
            setStatus({ message: 'Both fields are required!', type: 'error' });
            return;
        }

        if (newPassword.length < 6) {
            setStatus({ message: 'New password must be at least 6 characters.', type: 'error' });
            return;
        }

        try {
            await API.patch('/users/changePassword', { oldPassword, newPassword });
            setStatus({ message: 'Password updated successfully', type: 'success' });
            setOldPassword('');
            setNewPassword('');
        } catch (err) {
            const msg = err?.response?.data?.message || 'Failed to update password.';
            setStatus({ message: msg, type: 'error' });
        }
    };

    const alertColor = status.type === 'success' ? 'bg-green-100 text-green-700 border-green-300' : 'bg-red-100 text-red-700 border-red-300';

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-6"
            >
                <div className="text-center">
                    <img src="/logo.jpg" alt="Logo" className="h-12 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold">Reset Password</h2>
                </div>

                {/* Inline Toast Box */}
                {status.message && (
                    <div className={`border px-4 py-2 rounded text-sm ${alertColor}`}>
                        {status.message}
                    </div>
                )}

                {/* Form Fields */}
                <div>
                    <label className="block text-sm mb-1 font-medium">Current Password</label>
                    <div className="relative">
                        <input
                            type={showOld ? 'text' : 'password'}
                            className="w-full border px-3 py-2 pr-10 rounded"
                            placeholder="••••••••"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                        />
                        <span
                            className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
                            onClick={() => setShowOld(!showOld)}
                        >
                            {showOld ? '🙈' : '👁️'}
                        </span>
                    </div>
                </div>

                <div>
                    <label className="block text-sm mb-1 font-medium">New Password</label>
                    <div className="relative">
                        <input
                            type={showNew ? 'text' : 'password'}
                            className="w-full border px-3 py-2 pr-10 rounded"
                            placeholder="••••••••"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <span
                            className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
                            onClick={() => setShowNew(!showNew)}
                        >
                            {showNew ? '🙈' : '👁️'}
                        </span>
                    </div>
                </div>

                <button
                    type="submit"
                    className="bg-purple-600 text-white py-2 w-full rounded hover:bg-purple-700"
                >
                    Update Password
                </button>
            </form>
        </div>
    );
};

export default ResetPassword;
