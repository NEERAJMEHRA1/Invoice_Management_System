import React from "react";

const AuthLayout = ({ children }) => {
  return (
    <div className="h-screen w-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md text-center flex gap-12 items-center ">
        
        {/* Logo Section */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-500 shadow-md">
            <img
              src="/logo.jfif"
              alt="Logo"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Form Section */}
        <main className="text-left">{children}</main>
      </div>
    </div>
  );
};

export default AuthLayout;
