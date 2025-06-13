import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import AuthLayout from "../components/AuthLayout";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  return (
    <AuthLayout>
      <h2 className="text-xl font-semibold mb-4">Sign Up</h2>
      <form className="space-y-3">

        <input type="text" placeholder="Customer Name" className="w-full p-2 border rounded" />
        <input type="text" placeholder="Company Name" className="w-full p-2 border rounded" />
        <input type="text" placeholder="Address" className="w-full p-2 border rounded" />

        <div className="flex gap-3">
          <input type="text" placeholder="City" className="w-1/2 p-2 border rounded" />
          <input type="text" placeholder="Zipcode" className="w-1/2 p-2 border rounded" />
        </div>

        <input type="tel" placeholder="Phone No." className="w-full p-2 border rounded" />
        <input type="email" placeholder="Email ID" className="w-full p-2 border rounded" />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full p-2 border rounded pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            className="w-full p-2 border rounded pr-10"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <button className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">
          Sign up
        </button>
        <p className="text-sm text-center mt-3">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-500 hover:underline cursor-pointer"
          >
            Login
          </span>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Signup;
