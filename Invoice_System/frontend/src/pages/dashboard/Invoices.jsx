import React, { useEffect, useState } from 'react';
import API from '../../services/api';

const Invoices = () => {
    const [invoices, setInvoices] = useState([]);
    const [form, setForm] = useState({ items: [] });

    const fetchInvoices = async () => {
        const res = await API.post('/getAllInvoices');
        setInvoices(res.data);
    };

    const handleAddItem = () => {
        setForm({ ...form, items: [...(form.items || []), { description: '', qty: 1, rate: 0 }] });
    };

    const handleSave = async () => {
        await API.post('/invoice/createInvoice', form);
        setForm({ items: [] });
        fetchInvoices();
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    return (
        <div className="p-6">
            <h2 className="text-xl mb-4">Invoices</h2>
            <div className="mb-4">
                <input placeholder="Customer Name" value={form.customerName || ''} onChange={(e) => setForm({ ...form, customerName: e.target.value })} className="border p-2 mr-2" />
                <input placeholder="Remarks" value={form.remarks || ''} onChange={(e) => setForm({ ...form, remarks: e.target.value })} className="border p-2 mr-2" />
                <button onClick={handleAddItem} className="bg-gray-300 px-3 py-1 mr-2">+ Item</button>
                <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2">Save Invoice</button>
            </div>
            {form.items && form.items.map((item, index) => (
                <div key={index} className="mb-2 flex gap-2">
                    <input className="border p-1 w-1/3" placeholder="Description" value={item.description} onChange={(e) => {
                        const items = [...form.items];
                        items[index].description = e.target.value;
                        setForm({ ...form, items });
                    }} />
                    <input className="border p-1 w-1/6" type="number" placeholder="Qty" value={item.qty} onChange={(e) => {
                        const items = [...form.items];
                        items[index].qty = parseInt(e.target.value);
                        setForm({ ...form, items });
                    }} />
                    <input className="border p-1 w-1/6" type="number" placeholder="Rate" value={item.rate} onChange={(e) => {
                        const items = [...form.items];
                        items[index].rate = parseFloat(e.target.value);
                        setForm({ ...form, items });
                    }} />
                </div>
            ))}
            <h3 className="mt-6 mb-2 text-lg font-semibold">Invoice List</h3>
            <table className="w-full border">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border p-2">Invoice #</th>
                        <th className="border p-2">Customer</th>
                        <th className="border p-2">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {invoices.map((inv) => (
                        <tr key={inv._id}>
                            <td className="border p-2">{inv.invoiceNumber}</td>
                            <td className="border p-2">{inv.customerName}</td>
                            <td className="border p-2">₹{inv.invoiceAmount?.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Invoices;
