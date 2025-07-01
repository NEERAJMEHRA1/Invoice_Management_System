import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [invoices, setInvoices] = useState([]);
    const navigate = useNavigate();

    const fetchInvoices = async () => {
        try {
            const res = await API.post('/getAllInvoices');
            setInvoices(res.data || []);
        } catch (err) {
            console.error('Failed to fetch invoices');
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    const totalSales = invoices.reduce((sum, inv) => sum + (inv.invoiceAmount || 0), 0);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Dashboard Overview</h1>
            <div className="bg-white shadow p-6 rounded-md mb-6">
                <h2 className="text-xl mb-2">Total Sales</h2>
                <p className="text-3xl font-semibold text-green-600">₹{totalSales.toFixed(2)}</p>
            </div>
            <button
                onClick={() => navigate('/invoices')}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                ➕ Create New Invoice
            </button>
        </div>
    );
};

export default Dashboard;
