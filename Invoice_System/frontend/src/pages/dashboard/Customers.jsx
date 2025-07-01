import React, { useEffect, useState } from 'react';
import API from '../../services/api';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [form, setForm] = useState({});
    const [isEditing, setIsEditing] = useState(false);

    const fetchCustomers = async () => {
        const res = await API.get('/customers/getAllCustomers');
        setCustomers(res.data);
    };

    const handleSave = async () => {
        if (isEditing) {
            await API.put('/customers/updateCustomer', form);
        } else {
            await API.post('/customers/createCustomer', form);
        }
        setForm({});
        setIsEditing(false);
        fetchCustomers();
    };

    const handleEdit = (cust) => {
        setForm(cust);
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this customer?')) return;
        await API.delete('/customers/deleteCustomer', { data: { _id: id } });
        fetchCustomers();
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    return (
        <div className="p-6">
            <h2 className="text-xl mb-4">Customers</h2>
            <div className="flex gap-2 mb-4">
                <input placeholder="Name" value={form.customerName || ''} onChange={(e) => setForm({ ...form, customerName: e.target.value })} className="border p-2" />
                <input placeholder="Email" value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} className="border p-2" />
                <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2">{isEditing ? 'Update' : 'Add'}</button>
            </div>
            <table className="w-full border">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border p-2">Name</th>
                        <th className="border p-2">Email</th>
                        <th className="border p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {customers.map((cust) => (
                        <tr key={cust._id}>
                            <td className="border p-2">{cust.customerName}</td>
                            <td className="border p-2">{cust.email}</td>
                            <td className="border p-2">
                                <button onClick={() => handleEdit(cust)} className="text-blue-600 mr-2">Edit</button>
                                <button onClick={() => handleDelete(cust._id)} className="text-red-600">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Customers;
