import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';

const Register = () => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });
    const [showPass, setShowPass] = useState(false);
    const [status, setStatus] = useState({ message: '', type: '' });
    const navigate = useNavigate();

    const isValidEmail = (email) =>
        /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);

    const isStrongPassword = (password) => password.length >= 8;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ message: '', type: '' });

        if (!form.name || !form.email || !form.phone || !form.password || !form.confirmPassword) {
            setStatus({ message: 'All fields are required.', type: 'error' });
            return;
        }

        if (!isValidEmail(form.email)) {
            setStatus({ message: 'Please enter a valid email.', type: 'error' });
            return;
        }

        if (!isStrongPassword(form.password)) {
            setStatus({
                message: 'Password must be at least 8 characters.',
                type: 'error',
            });
            return;
        }

        if (form.password !== form.confirmPassword) {
            setStatus({ message: 'Passwords do not match.', type: 'error' });
            return;
        }

        try {
            await API.post('/users/userRegister', form);
            setStatus({ message: 'Registration successful! Redirecting...', type: 'success' });
            setTimeout(() => navigate('/login'), 1500);
        } catch (err) {
            const msg = err?.response?.data?.message || 'Registration failed.';
            setStatus({ message: msg, type: 'error' });
        }
    };

    const alertColor =
        status.type === 'success'
            ? 'bg-green-100 text-green-700 border-green-300'
            : 'bg-red-100 text-red-700 border-red-300';

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-5"
            >
                <div className="text-center">
                    <img src="/logo.jpg" alt="Logo" className="h-12 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold">Create your account</h2>
                </div>

                {status.message && (
                    <div className={`border px-4 py-2 rounded text-sm ${alertColor}`}>
                        {status.message}
                    </div>
                )}

                <input
                    type="text"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                />

                <input
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                />

                <input
                    type="text"
                    placeholder="Phone"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                />

                <div className="relative">
                    <input
                        type={showPass ? 'text' : 'password'}
                        placeholder="Password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        className="w-full border border-gray-300 rounded px-3 py-2 pr-10"
                    />
                    <span
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
                    >
                        {showPass ? '🙈' : '👁️'}
                    </span>
                </div>

                <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="Confirm Password"
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                />

                <button
                    type="submit"
                    className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
                >
                    Register
                </button>

                <p className="text-sm text-center">
                    Already have an account?{' '}
                    <a href="/login" className="text-blue-600 hover:underline font-medium">
                        Sign in
                    </a>
                </p>
            </form>
        </div>
    );
};

export default Register;
