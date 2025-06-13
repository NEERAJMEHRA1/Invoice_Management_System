import React, { useState, useRef, useEffect } from "react";

const Navbar = ({ title }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-white h-16 shadow flex justify-between items-center px-6 relative ">
      <h1 className="text-lg font-semibold">{title}</h1>

      <div className="relative" ref={dropdownRef}>
        <img
          src="/profile.jfif"
          alt="Profile"
          className="w-10 h-10 rounded-full border border-gray-300 object-cover cursor-pointer"
          onClick={() => setDropdownOpen((prev) => !prev)}
        />

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden border z-50">
            <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
              Reset Password
            </button>
            <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
