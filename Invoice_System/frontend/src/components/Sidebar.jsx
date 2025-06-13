import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 bg-white shadow-md h-full flex flex-col justify-between">
      <div className="p-4 space-y-4">
        <h2 className="text-xl font-bold mb-6">Invoice</h2>
        <NavLink to="/" className="block p-2 hover:bg-gray-100 rounded">Home</NavLink>
        <NavLink to="/customers" className="block p-2 hover:bg-gray-100 rounded">Customers</NavLink>
        <NavLink to="/invoices" className="block p-2 hover:bg-gray-100 rounded">Invoices</NavLink>
      </div>

      {/* Logo at the bottom */}
      <div className="p-4">
        <div className="w-16 h-16 mx-auto rounded-full overflow-hidden border-4 border-blue-500 shadow-md">
          <img src="/logo.jfif" alt="Logo" className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
