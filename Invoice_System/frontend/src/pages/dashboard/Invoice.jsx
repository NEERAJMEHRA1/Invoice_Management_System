import React, { useState } from "react";
import {
  FaSearch,
  FaSyncAlt,
  FaDownload,
  FaPlus,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import Navbar from "../../components/Navbar";
import InvoicePopup from "../../components/InvoicePopup";

const dummyInvoices = [
  {
    id: 101,
    date: "30/01/2025",
    customer: "Daniel",
    amount: "₹1500.00",
    remarks: "Test invoice",
  },
];

const Invoice = () => {
  const [search, setSearch] = useState("");
  const [exportOpen, setExportOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState("");
  const [customerFilter, setCustomerFilter] = useState("");
   const [showModal, setShowModal] = useState(false); 
  const handleReset = () => {
    setSearch("");
    setDateFilter("");
    setCustomerFilter("");
  };

  const filteredData = dummyInvoices.filter((inv) => {
    return (
      inv.customer.toLowerCase().includes(customerFilter.toLowerCase()) &&
      inv.date.includes(dateFilter) &&
      inv.customer.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="flex-1 flex flex-col">
      <Navbar title="Invoices" />
      {showModal && <InvoicePopup onClose={() => setShowModal(false)} />}
      <div className="flex justify-between items-center mb-4 pt-5">
        <h2 className="text-xl font-semibold">Invoice List</h2>

        <div className="flex items-center gap-2">
          <button
            className="bg-blue-500 text-white p-2 rounded"
            title="New Invoice"
            onClick={() => setShowModal(true)}
          >
            <FaPlus />
          </button>

          {/* Filters */}
          <input
            type="text"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            placeholder="Date Filter"
            className="px-2 py-1 border rounded"
          />
          <input
            type="text"
            value={customerFilter}
            onChange={(e) => setCustomerFilter(e.target.value)}
            placeholder="Customer Filter"
            className="px-2 py-1 border rounded"
          />

          {/* Search + Reset */}
          <div className="flex border rounded overflow-hidden">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className="px-3 py-1 outline-none"
            />
            <button
              onClick={handleReset}
              className="px-3 bg-gray-200 hover:bg-gray-300"
            >
              <FaSyncAlt />
            </button>
          </div>

          {/* Export Dropdown */}
          <div className="relative">
            <button
              onClick={() => setExportOpen((prev) => !prev)}
              className="bg-gray-200 p-2 rounded hover:bg-gray-300"
            >
              <FaDownload />
            </button>
            {exportOpen && (
              <div className="absolute right-0 mt-2 bg-white border rounded shadow w-32 z-10">
                <button className="w-full px-3 py-2 text-left hover:bg-gray-100">
                  PDF
                </button>
                <button className="w-full px-3 py-2 text-left hover:bg-gray-100">
                  Excel
                </button>
                <button className="w-full px-3 py-2 text-left hover:bg-gray-100">
                  CSV
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Invoice Table */}
      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Invoice #</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Customer</th>
              <th className="border p-2">Invoice Amount</th>
              <th className="border p-2">Remarks</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-4">
                  No invoices found.
                </td>
              </tr>
            ) : (
              filteredData.map((inv) => (
                <tr key={inv.id}>
                  <td className="border p-2">{inv.id}</td>
                  <td className="border p-2">{inv.date}</td>
                  <td className="border p-2">{inv.customer}</td>
                  <td className="border p-2">{inv.amount}</td>
                  <td className="border p-2">{inv.remarks}</td>
                  <td className="border p-2 flex gap-2 justify-center">
                    <button className="text-blue-500 hover:underline">
                      <FaEdit />
                    </button>
                    <button className="text-red-500 hover:underline">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Invoice;
