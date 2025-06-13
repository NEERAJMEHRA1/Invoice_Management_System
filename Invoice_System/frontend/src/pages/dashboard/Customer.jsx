import React, { useState } from "react";
import { FaSearch, FaSyncAlt, FaDownload, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import Navbar from "../../components/Navbar";
import CustomerFormModal from "../../components/CustomerFormModal";

const dummyData = [
  {
    id: 1,
    customer: "Daniel",
    company: "Alit",
    address: "Street Road, Newyork, 32202",
    email: "daniel@gmail.com",
    phone: "9525467841",
  },
];

const Customer = () => {
  const [search, setSearch] = useState("");
  const [exportOpen, setExportOpen] = useState(false);
  const [showModal, setShowModal] = useState(false); 

  const filteredData = dummyData.filter((c) =>
    c.customer.toLowerCase().includes(search.toLowerCase())
  );

  const handleReset = () => setSearch("");

  return (
    <div className=" flex-1 flex flex-col -top-0.5">
        
        <Navbar title="Customers" />
        {showModal && <CustomerFormModal onClose={() => setShowModal(false)} />}
      <div className="flex justify-between items-center mb-4 pt-5">
        <h2 className="text-xl font-semibold">Customer List</h2>

        <div className="flex items-center gap-2">
        <button
            className="bg-blue-500 text-white p-2 rounded"
            title="New Customer"
            onClick={() => setShowModal(true)} 
          >
            <FaPlus />
          </button>

          <div className="flex border rounded overflow-hidden">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className="px-3 py-1 outline-none"
            />
            <button onClick={handleReset} className="px-3 bg-gray-200 hover:bg-gray-300">
              <FaSyncAlt />
            </button>
          </div>

          <div className="relative">
            <button
              onClick={() => setExportOpen((prev) => !prev)}
              className="bg-gray-200 p-2 rounded hover:bg-gray-300"
            >
              <FaDownload />
            </button>
            {exportOpen && (
              <div className="absolute right-0 mt-2 bg-white border rounded shadow w-32 z-10">
                <button className="w-full px-3 py-2 text-left hover:bg-gray-100">PDF</button>
                <button className="w-full px-3 py-2 text-left hover:bg-gray-100">Excel</button>
                <button className="w-full px-3 py-2 text-left hover:bg-gray-100">CSV</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Customer</th>
              <th className="border p-2">Company</th>
              <th className="border p-2">Address</th>
              <th className="border p-2">Email ID</th>
              <th className="border p-2">Phone No.</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-4">
                  No customers found.
                </td>
              </tr>
            ) : (
              filteredData.map((cust) => (
                <tr key={cust.id}>
                  <td className="border p-2">{cust.customer}</td>
                  <td className="border p-2">{cust.company}</td>
                  <td className="border p-2">{cust.address}</td>
                  <td className="border p-2">{cust.email}</td>
                  <td className="border p-2">{cust.phone}</td>
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

export default Customer;
