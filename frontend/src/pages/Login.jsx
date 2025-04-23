import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/clogo.png"; // Ensure the correct path
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const validateEmail = (email) => {
    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com|protonmail\.com|hotmail\.com)$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[0-9])(?=.*[!@#$%^&])[a-zA-Z0-9!@#$%^&]{6,15}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail) {
      toast.error("Email is required.");
      return;
    } else if (!validateEmail(trimmedEmail)) {
      toast.error("Invalid email. Must be Gmail, Yahoo, Outlook, etc.");
      return;
    }

    if (!trimmedPassword) {
      toast.error("Password is required.");
      return;
    } else if (!validatePassword(trimmedPassword)) {
      toast.error("Password must be 6-15 characters long, with one number and one special character.");
      return;
    }

    const success = await login(trimmedEmail, trimmedPassword);
    if (!success) {
      toast.error("Incorrect email or password. Please try again.");
    } else {
      toast.success("Login Successful! Redirecting...");
      setTimeout(() => {
        navigate("/dashboard");
      }, 3000); // 3 seconds
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-200">
      <div className="bg-blue-300 bg-opacity-50 p-10 rounded-3xl shadow-2xl w-full max-w-4xl border border-gray-700 transform hover:scale-105 transition duration-500 flex">
        {/* Left Section - Logo */}
        <div className="hidden md:flex md:w-1/2 justify-center items-center">
          <img src={logo} alt="Logo" className="w-3/4" />
        </div>

        {/* Right Section - Login Form */}
        <div className="w-full md:w-1/2 flex flex-col items-center">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 text-center mb-6">
            MANAGEMATE
          </h1>
          <h2 className="text-gray-800 text-3xl font-extrabold mb-6 text-center">
            Welcome Back
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col w-full">
            <input
              type="email"
              placeholder="Email "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-2 p-3 rounded-xl bg-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-400 focus:bg-gray-900 w-full"
            />

            <input
              type="password"
              placeholder="Password "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-2 p-3 rounded-xl bg-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-400 focus:bg-gray-900 w-full"
            />

            <div className="flex gap-4 mt-4">
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl font-semibold tracking-wide transition duration-300 shadow-lg w-full"
              >
                Login
              </button>
            </div>
          </form>

          <p className="text-gray-900 text-center mt-4">
            Don't have an account?
            <Link to="/register" className="text-blue-800 hover:text-blue-500">
              {" "}
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Toast Notifications */}
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default Login;