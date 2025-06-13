import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import CustomerFormModal from "./CustomerFormModal";

const InvoicePopup = ({ onClose }) => {
  const [items, setItems] = useState([
    { description: "Mango", rate: 50, qty: 50, discountPercent: 0 },
  ]);
  const [showModal, setShowModal] = useState(false); 

  const addItem = () => {
    setItems([...items, { description: "", rate: 0, qty: 1, discountPercent: 0 }]);
  };

  const handleChange = (index, key, value) => {
    const newItems = [...items];
    newItems[index][key] = value;
    setItems(newItems);
  };

  const deleteItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const totalAmount = items.reduce((acc, item) => {
    const amount = item.rate * item.qty * (1 - item.discountPercent / 100);
    return acc + amount;
  }, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center  ">
         {showModal && <CustomerFormModal onClose={() => setShowModal(false)} />}
      <div className="bg-white rounded-md shadow-lg w-[900px] max-h-[90vh] overflow-y-auto p-6 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-xl">✕</button>

        <h2 className="text-xl font-semibold mb-4">Add Invoice</h2>

        <div className="flex gap-4 mb-4">
          <input type="text" placeholder="Invoice No" className="border px-3 py-2 rounded w-1/2" />
          <input type="date" className="border px-3 py-2 rounded w-1/2" />
        </div>

        <div className="flex items-center gap-2 mb-4">
          <select className="border px-3 py-2 rounded w-full">
            <option>Select Customer</option>
            <option>Daniel</option>
            <option>Alex</option>
          </select>
          <button className="bg-blue-500 text-white p-2 rounded" onClick={() => setShowModal(true)} >
            <FaPlus />
          </button>
        </div>

        <div className="border p-4 mb-4">
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Sr No.</th>
                <th className="border p-2">Description</th>
                <th className="border p-2">Rate</th>
                <th className="border p-2">Qty</th>
                <th className="border p-2">Discount %</th>
                <th className="border p-2">Amount</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => {
                const amount = item.rate * item.qty * (1 - item.discountPercent / 100);
                return (
                  <tr key={index}>
                    <td className="border p-2 text-center">{index + 1}</td>
                    <td className="border p-2">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleChange(index, "description", e.target.value)}
                        className="w-full border px-2 py-1"
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="number"
                        value={item.rate}
                        onChange={(e) => handleChange(index, "rate", Number(e.target.value))}
                        className="w-full border px-2 py-1"
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="number"
                        value={item.qty}
                        onChange={(e) => handleChange(index, "qty", Number(e.target.value))}
                        className="w-full border px-2 py-1"
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="number"
                        value={item.discountPercent}
                        onChange={(e) => handleChange(index, "discountPercent", Number(e.target.value))}
                        className="w-full border px-2 py-1"
                      />
                    </td>
                    <td className="border p-2 text-right">₹{amount.toFixed(2)}</td>
                    <td className="border p-2 text-center">
                      <button onClick={() => deleteItem(index)} className="text-red-500">Delete</button>
                    </td>
                  </tr>
                );
              })}
              <tr>
                <td colSpan="7" className="text-right p-2">
                  <button
                    onClick={addItem}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    + Add Row
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="flex justify-between mt-4">
            <textarea placeholder="Remarks" className="border w-[60%] h-24 px-2 py-1" />
            <div className="w-[35%]">
              <div className="flex gap-2 mb-2">
                <input type="text" placeholder="Description" className="border px-2 py-1 w-1/2" />
                <input type="text" placeholder="Add/Less" className="border px-2 py-1 w-1/4" />
                <input type="text" placeholder="Amount" className="border px-2 py-1 w-1/4" />
              </div>
              <div className="text-right font-semibold">
                Invoice Amount: ₹{totalAmount.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button className="px-4 py-2 bg-gray-200 rounded">New</button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded">Save</button>
          <button className="px-4 py-2 bg-green-500 text-white rounded">Save & Print</button>
          <button className="px-4 py-2 bg-red-400 text-white rounded">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default InvoicePopup;
