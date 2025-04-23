import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/clogo.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
  
const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Manager",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { name, email, password } = formData;
    if (!name.trim()) return "Full Name is required.";
    if (name.length > 15) return "Full Name cannot exceed 15 characters.";

    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com|protonmail\.com|hotmail\.com)$/;
    if (!email.trim()) return "Email is required.";
    if (!emailRegex.test(email))
      return "Please enter a valid email (Gmail, Yahoo, Outlook, etc.).";

    const passwordRegex =
      /^(?=.*[0-9])(?=.*[!@#$%^&])[a-zA-Z0-9!@#$%^&]{6,15}$/;
    if (!password) return "Password is required.";
    if (!passwordRegex.test(password))
      return "Password must be 6-15 characters long, with at least one number and one special character.";

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }
  
    const success = await register(
      formData.name,
      formData.email,
      formData.password,
      formData.role
    );
  
    if (!success) {
      toast.error("Registration failed! Please try again.");
    } else {
      toast.success("Registration Successful! ...");
      setTimeout(() => {
        navigate("/");
      }, 3200);
    }
  };
  

  const handleClear = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "Manager",
    });
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-200">
      <div className="bg-blue-300 bg-opacity-50 p-10 rounded-3xl shadow-2xl w-full max-w-4xl border border-gray-700 flex">
        <div className="hidden md:flex md:w-1/2 justify-center items-center">
          <img src={logo} alt="Logo" className="w-3/4" />
        </div>
        <div className="w-full md:w-1/2 flex flex-col items-center">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 text-center mb-6">
            Create Account
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col w-full">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              maxLength="15"
              className="mb-4 p-3 rounded-xl bg-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="mb-4 p-3 rounded-xl bg-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="password"
              name="password"
              placeholder="Password "
              value={formData.password}
              onChange={handleChange}
              maxLength="15"
              className="mb-4 p-3 rounded-xl bg-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-400"
            />
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="mb-4 p-3 rounded-xl bg-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="Manager">Manager</option>
              <option value="Project Leader">Project Leader</option>
              <option value="Team Member">Team Member</option>
            </select>

            <div className="flex justify-between gap-4">
              <button
                type="submit"
                className="w-1/2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl font-semibold"
              >
                Register
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="w-1/2 bg-gradient-to-r from-gray-500 to-gray-700 hover:from-gray-600 hover:to-gray-800 text-white py-3 rounded-xl font-semibold"
              >
                Clear
              </button>
            </div>
          </form>

          <p className="text-gray-900 text-center mt-4">
            Already have an account?{" "}
            <Link to="/" className="text-blue-800 hover:text-blue-500">
              Login
            </Link>
          </p>
        </div>
      </div>

      {/* Toast Notifications */}
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default Register;