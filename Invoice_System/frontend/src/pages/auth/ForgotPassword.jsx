import React, { useState } from 'react';
import API from '../../services/api';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState({ message: '', type: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ message: '', type: '' });

        if (!email) {
            setStatus({ message: 'Email is required.', type: 'error' });
            return;
        }

        try {
            await API.post('/users/forgotPassword', { email }); // <-- confirm API path
            setStatus({
                message: 'If your email exists, a password reset link has been sent.',
                type: 'success',
            });
        } catch (err) {
            const msg = err?.response?.data?.message || 'Failed to send reset email.';
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
                className="bg-white p-6 rounded shadow-md w-full max-w-md space-y-6"
            >
                <div className="text-center">
                    <img src="/logo.jpg" alt="Logo" className="h-20 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold">Forgot Password</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Enter your email to receive a password reset link.
                    </p>
                </div>

                {status.message && (
                    <div className={`border px-4 py-2 rounded text-sm ${alertColor}`}>
                        {status.message}
                    </div>
                )}

                <input
                    type="email"
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <button
                    type="submit"
                    className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
                >
                    Send Reset Link
                </button>

                <p className="text-sm text-center">
                    Remembered your password?{' '}
                    <a href="/login" className="text-blue-600 hover:underline">
                        Back to Login
                    </a>
                </p>
            </form>
        </div>
    );
};

export default ForgotPassword;
