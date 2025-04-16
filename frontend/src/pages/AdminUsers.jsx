import { useEffect } from "react";
import { useAdmin } from "../context/AdminContext";

const AdminUsers = () => {
  const { adminUsers, fetchAdminUsers, updateUserRole } = useAdmin();

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
    <div className="p-8 ml-64">
      <h2 className="text-2xl font-bold mb-4">All Users</h2>
      <table className="min-w-full table-auto bg-white rounded shadow">
        <thead>
          <tr>
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
                  className="border p-1 rounded"
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
