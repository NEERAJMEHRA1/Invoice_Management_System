import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import AuthLayout from "../components/AuthLayout";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/features/authSlice";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { status, error } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await dispatch(loginUser({ email, password }));

    if (res.type === "auth/loginUser/fulfilled") {
      navigate("/"); // ✅ Go to dashboard
    }
  };

  return (
    <AuthLayout>
      <h2 className="text-xl font-semibold mb-4">Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="relative mb-3">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full p-2 border rounded pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
          </button>
        </div>

        {status === "loading" && <p className="text-blue-500">Logging in...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="flex justify-between items-center gap-4">
          <button
            type="submit"
            className="flex-1 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Login
          </button>

          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="flex-1 bg-gray-200 text-blue-500 p-2 rounded hover:bg-gray-300"
          >
            Signup
          </button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Login;
