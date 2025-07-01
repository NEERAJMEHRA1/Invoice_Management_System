import React, { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import API from '../services/api';

const DashboardLayout = () => {
    const [user, setUser] = useState({});
    const [menuOpen, setMenuOpen] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const navigate = useNavigate();

    const fetchUser = async () => {
        try {
            const res = await API.get('/users/getUserDetail');
            setUser(res.data.data);
        } catch {
            navigate('/login');
        }
    };

    const handleLogout = async () => {
        try {
            await API.get('/users/userLogOut');
        } catch (err) {
            console.error('Logout failed:', err);
        }

        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userPassword');

        navigate('/login');
    };

    const handleDelete = async () => {
        try {
            await API.delete('/users/updateUserDetail');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setConfirmDelete(false);
            navigate('/register');
        } catch (err) {
            alert('Failed to delete account.');
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <header className="bg-white shadow px-6 py-3 flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-700">Invoice Dashboard</h1>
                <div className="relative">
                    <div
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="cursor-pointer"
                    >
                        {user?.logo ? (
                            <img
                                src={user.logo}
                                alt="Profile"
                                className="w-10 h-10 rounded-full object-cover border"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center text-lg font-semibold">
                                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                        )}
                    </div>

                    {menuOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-white shadow-md rounded p-4 z-50">
                            <div className="mb-3 border-b pb-2">
                                <p className="text-sm font-medium">{user?.name}</p>
                                <p className="text-xs text-gray-500">{user?.email}</p>
                            </div>
                            <button
                                onClick={() => navigate('/profile')}
                                className="block w-full text-left text-sm text-gray-700 hover:text-purple-600 mb-2"
                            >
                                👤 My Profile
                            </button>
                            <button
                                onClick={() => navigate('/reset-password')}
                                className="block w-full text-left text-sm text-gray-700 hover:text-purple-600 mb-2"
                            >
                                🔒 Reset Password
                            </button>
                            <button
                                onClick={() => setConfirmDelete(true)}
                                className="block w-full text-left text-sm text-red-600 hover:text-red-700 mb-2"
                            >
                                ❌ Delete Account
                            </button>
                            <button
                                onClick={handleLogout}
                                className="block w-full text-left text-sm text-red-600 hover:text-red-700"
                            >
                                🚪 Log Out
                            </button>
                        </div>
                    )}

                    {confirmDelete && (
                        <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded p-4 z-50 border border-red-200">
                            <p className="text-sm text-red-600 mb-4">Are you sure you want to delete your account?</p>
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => setConfirmDelete(false)}
                                    className="px-4 py-1 border rounded hover:bg-gray-100 text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="px-4 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                                >
                                    Confirm Delete
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            <div className="flex flex-1">
                <aside className="w-64 bg-white shadow-md p-4 hidden md:block">
                    <nav className="space-y-3">
                        <Link to="/" className="block text-blue-600 hover:underline">🏠 Dashboard</Link>
                        <Link to="/customers" className="block text-blue-600 hover:underline">👥 Customers</Link>
                        <Link to="/invoices" className="block text-blue-600 hover:underline">🧾 Invoices</Link>
                    </nav>
                </aside>

                <main className="flex-1 p-6 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
