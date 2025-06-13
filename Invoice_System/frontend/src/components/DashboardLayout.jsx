import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      
       
        <div className="p-6 overflow-auto flex-1">
          <Outlet />
        </div>
      </div>
    
  );
};

export default DashboardLayout;
