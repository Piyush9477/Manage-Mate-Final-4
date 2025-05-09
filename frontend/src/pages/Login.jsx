import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/clogo.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
      toast.error("Invalid email. Please enter a valid email address.");
      return;
    }

    if (!trimmedPassword) {
      toast.error("Password is required.");
      return;
    } else if (!validatePassword(trimmedPassword)) {
      toast.error(
        "Password must be 8-15 characters long, include a number and special character."
      );
      return;
    }

    const success = await login(trimmedEmail, trimmedPassword);
    if (!success) {
      toast.error("Incorrect email or password. Please try again.");
    } else {
      toast.success("Login Successful! Redirecting...");
      const user = JSON.parse(localStorage.getItem("user"));
      if (user.role === "Admin") {
        setTimeout(() => {
          navigate("/admin/dashboard");
        }, 1000);
      } else {
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-200">
      <div className="bg-blue-300 bg-opacity-50 p-10 rounded-3xl shadow-2xl w-full max-w-4xl border border-gray-700 transform hover:scale-105 transition duration-500 flex">
        <div className="hidden md:flex md:w-1/2 justify-center items-center">
          <img src={logo} alt="Logo" className="w-3/4" />
        </div>

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
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              minLength={8}
              maxLength={35}
              className="mb-2 p-3 rounded-xl bg-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-400 focus:bg-gray-900 w-full"
            />

            <div className="relative mb-4">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                maxLength={15}
                className="w-full p-3 pr-10 rounded-xl bg-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-400 focus:bg-gray-900"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-white"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>

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

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default Login;