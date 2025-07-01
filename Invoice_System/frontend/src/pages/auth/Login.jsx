import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [status, setStatus] = useState({ message: '', type: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const savedEmail = localStorage.getItem('userEmail');
        const savedPass = localStorage.getItem('userPassword');
        if (savedEmail && savedPass) {
            setEmail(savedEmail);
            setPassword(savedPass);
            setRememberMe(true);
        }
    }, []);

    const isValidEmail = (value) =>
        /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);

    const handleLogin = async (e) => {
        e.preventDefault();
        setStatus({ message: '', type: '' });

        if (!isValidEmail(email)) {
            setStatus({ message: 'Please enter a valid email address.', type: 'error' });
            return;
        }

        if (password.length < 8) {
            setStatus({ message: 'Password must be at least 8 characters.', type: 'error' });
            return;
        }

        try {
            const res = await API.post('/users/userLogin', { email, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.data));

            if (rememberMe) {
                localStorage.setItem('userEmail', email);
                localStorage.setItem('userPassword', password);
            } else {
                localStorage.removeItem('userEmail');
                localStorage.removeItem('userPassword');
            }

            setStatus({ message: 'Login successful! Redirecting...', type: 'success' });
            setTimeout(() => navigate('/'), 1000);
        } catch (err) {
            const msg = err?.response?.data?.message || 'Login failed. Please try again.';
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
                onSubmit={handleLogin}
                className="bg-white p-4 rounded shadow-md w-full max-w-md space-y-6"
            >
                <div className="text-center">
                    <img src="/logo.jpg" alt="Logo" className="h-20 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold">Sign in to your account</h2>
                </div>

                {status.message && (
                    <div className={`border px-4 py-2 rounded text-sm ${alertColor}`}>
                        {status.message}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                        type="email"
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <div className="relative">
                        <input
                            type={showPass ? 'text' : 'password'}
                            className="w-full border border-gray-300 rounded px-3 py-2 pr-10"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <span
                            onClick={() => setShowPass(!showPass)}
                            className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
                        >
                            {showPass ? '🙈' : '👁️'}
                        </span>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <label className="flex items-center text-sm">
                        <input
                            type="checkbox"
                            className="mr-2"
                            checked={rememberMe}
                            onChange={() => setRememberMe(!rememberMe)}
                        />
                        Remember me
                    </label>
                    <span
                        onClick={() => navigate('/forgot-password')}
                        className="text-sm text-blue-600 hover:underline cursor-pointer"
                    >
                        Forgot Password?
                    </span>

                </div>

                <button
                    type="submit"
                    className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
                >
                    Login
                </button>

                <p className="text-sm text-center">
                    Don’t have an account?{' '}
                    <a href="/register" className="text-blue-600 hover:underline font-medium">
                        Sign up
                    </a>
                </p>
            </form>
        </div>
    );
};

export default Login;
