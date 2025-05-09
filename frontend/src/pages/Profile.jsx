import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const Profile = () => {
  const { profile, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", password: "", profilePicture: null });
  const [message, setMessage] = useState("");
  const { darkMode } = useTheme();

  const handleFileChange = (e) => {
    setFormData({ ...formData, profilePicture: e.target.files[0] });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!formData.name && !formData.password && !formData.profilePicture) {
      setMessage("Please provide at least one field to update.");
      return;
    }

    try {
      const response = await updateProfile(formData);
      if (response.success) {
        setMessage("Profile updated successfully.");
        setTimeout(() => {
          setIsEditing(false);
          setFormData({ name: "", password: "" });
        }, 1000);
      } else {
        setMessage(response.message || "Failed to update profile.");
      }
    } catch (error) {
      setMessage("Error updating profile.");
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center h-screen ${darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"}`}>
      <div className={`shadow-lg rounded-lg p-8 w-96 ${darkMode ? "bg-gray-700" : "bg-white"}`}>
        <h2 className="text-2xl font-bold mb-4 text-center">Profile</h2>

        {profile ? (
          <div>
            {profile.profilePicture && (
              <div className="mb-4 text-center">
                <img
                  src={`http://localhost:5001${profile.profilePicture}`}
                  alt="Profile"
                  className="w-24 h-24 rounded-full mx-auto object-cover"
                />
              </div>
            )}
            <p className="mb-2">
              <span className="font-semibold">Name:</span> {profile.name}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Email:</span> {profile.email}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Role:</span> {profile.role}
            </p>
          </div>
        ) : (
          <p className="text-red-500 text-center">No profile data available.</p>
        )}

        <button
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-500"
          onClick={() => {
            setMessage("");
            setIsEditing(true);
          }}
        >
          Edit Profile
        </button>

        <button
          className="mt-3 w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800"
          onClick={() => {
            const user = JSON.parse(localStorage.getItem("user"));
            if(user.role === "Admin") {
              navigate("/admin/dashboard");
            }
            else{
              navigate("/dashboard");
            }
          }}
        >
          Back to Dashboard
        </button>
      </div>

      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className={`shadow-lg rounded-lg p-6 w-96 ${darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-900"}`}>
            <h3 className="text-xl font-bold mb-4">Edit Profile</h3>

            {message && <p className="text-red-500 text-sm">{message}</p>}

            <form onSubmit={handleUpdate}>
              <div className="mb-3">
                <label htmlFor="name" className="block text-sm font-medium">New Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  autoComplete="name"
                  placeholder="Enter new name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg ${darkMode ? "bg-gray-600 border-gray-500 text-white" : ""}`}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="block text-sm font-medium">New Password:</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  autoComplete="new-password"
                  placeholder="Enter new password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg ${darkMode ? "bg-gray-600 border-gray-500 text-white" : ""}`}
                />
              </div>

              {profile.profilePicture && (
                <div className="mb-3 text-center">
                  <img
                    src={`http://localhost:5001${profile.profilePicture}`}
                    alt="Profile"
                    className="w-24 h-24 rounded-full mx-auto mb-2 object-cover"
                  />
                  <p className="text-sm text-gray-400">Current Profile Picture</p>
                </div>
              )}

              <div className="mb-3">
                <label htmlFor="profilePicture" className="block text-sm font-medium">
                  {profile.profilePicture ? "Change Profile Picture:" : "Upload Profile Picture:"}
                </label>
                <input
                  type="file"
                  id="profilePicture"
                  name="profilePicture"
                  accept="image/*"
                  onChange={handleFileChange}
                  className={`w-full px-3 py-2 border rounded-lg ${darkMode ? "bg-gray-600 border-gray-500 text-white" : ""}`}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-500"
              >
                Save Changes
              </button>

              <button
                type="button"
                className="mt-2 w-full bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
