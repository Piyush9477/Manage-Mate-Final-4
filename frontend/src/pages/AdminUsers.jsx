import { useEffect } from "react";
import { useAdmin } from "../context/AdminContext";
import { useTheme } from "../context/ThemeContext";

const AdminUsers = () => {
  const { adminUsers, fetchAdminUsers, updateUserRole } = useAdmin();
  const { darkMode } = useTheme();

  useEffect(() => {
    fetchAdminUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    const result = await updateUserRole(userId, newRole);
    if (result.success) {
      alert("Role updated!");
    } else {
      alert(result.message || "Failed to update role");
    }
  };

  return (
    <div className={`p-8 ml-64 min-h-screen transition-all duration-300 ${
      darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
    }`}>
      <h2 className="text-2xl font-bold mb-4">All Users</h2>
      <table className={`min-w-full table-auto rounded shadow ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
      }`}>
        <thead>
          <tr className={darkMode ? "bg-gray-700" : "bg-gray-200"}>
            <th className="p-2">Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Change Role</th>
          </tr>
        </thead>
        <tbody>
          {adminUsers.map((user) => (
            <tr key={user._id} className="border-t">
              <td className="p-2">{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user._id, e.target.value)}
                  className={`border p-1 rounded ${
                    darkMode ? "bg-gray-700 text-white border-white" : "bg-white text-black border-gray-300"
                  }`}
                >
                  <option value="Manager">Manager</option>
                  <option value="Project Leader">Project Leader</option>
                  <option value="Team Member">Team Member</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsers;
