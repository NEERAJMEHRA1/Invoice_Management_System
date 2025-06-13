// src/components/CustomerFormModal.jsx
import React from "react";
import { FaTimes } from "react-icons/fa";

const CustomerFormModal = ({ onClose }) => {
  return (
    <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-50">

      <div className="bg-white w-[500px] p-6 rounded shadow-lg relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Add/Edit Customer</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-red-500 text-xl">
            <FaTimes />
          </button>
        </div>

        <form className="space-y-3">
          <input type="text" placeholder="Customer Name" className="w-full border p-2 rounded" />
          <input type="text" placeholder="Company Name" className="w-full border p-2 rounded" />
          <input type="text" placeholder="Address" className="w-full border p-2 rounded" />

          <div className="flex gap-2">
            <input type="text" placeholder="City" className="w-1/3 border p-2 rounded" />
            <input type="text" placeholder="Zipcode" className="w-1/3 border p-2 rounded" />
            <input type="text" placeholder="Credit Limit" className="w-1/3 border p-2 rounded" />
          </div>

          <div className="flex gap-2">
            <input type="text" placeholder="Phone No." className="w-1/2 border p-2 rounded" />
            <input type="email" placeholder="Email ID" className="w-1/2 border p-2 rounded" />
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Save
            </button>
            <button type="button" onClick={onClose} className="border px-4 py-2 rounded">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerFormModal;
