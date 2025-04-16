import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useAdmin } from "../context/AdminContext";
import { ClipboardList, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const { adminProjects, adminUsers, fetchAdminProjects, fetchAdminUsers } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === "Admin") {
      fetchAdminProjects();
      fetchAdminUsers();
    }
  }, [user]);

  const roleCounts = {
    Manager: 0,
    "Project Leader": 0,
    "Team Member": 0
  };

  adminUsers.forEach(user => {
    if (roleCounts[user.role] !== undefined) {
      roleCounts[user.role]++;
    }
  });

  return (
    <div className={`flex flex-col items-center p-8 ml-64 min-h-screen transition-all duration-300 ${
      darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
    }`}>
      <h1 className="text-4xl font-bold mb-4 text-gray-900">Welcome, {user?.name}</h1>
      <p className="text-xl mb-4 text-gray-700">Role: {user?.role}</p>

      {user?.role === "Admin" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
            <div
              className="p-6 rounded-lg shadow-lg bg-white text-black cursor-pointer"
              onClick={() => navigate("/admin/projects")}
            >
              <div className="flex items-center space-x-4">
                <div className="p-4 bg-blue-500 text-white rounded-full">
                  <ClipboardList size={28} />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Total Projects</p>
                  <h2 className="text-2xl font-bold">{adminProjects.length}</h2>
                </div>
              </div>
            </div>

            <div
              className="p-6 rounded-lg shadow-lg bg-white text-black cursor-pointer"
              onClick={() => navigate("/admin/users")}
            >
              <div className="flex items-center space-x-4">
                <div className="p-4 bg-green-500 text-white rounded-full">
                  <Users size={28} />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Total Users</p>
                  <h2 className="text-2xl font-bold">{adminUsers.length}</h2>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-lg shadow-lg bg-white text-black">
              <div className="flex flex-col gap-2">
                <p className="text-gray-500 text-sm">User Roles</p>
                <div className="flex justify-between">
                  <span>Managers:</span> <span>{roleCounts["Manager"]}</span>
                </div>
                <div className="flex justify-between">
                  <span>Project Leaders:</span> <span>{roleCounts["Project Leader"]}</span>
                </div>
                <div className="flex justify-between">
                  <span>Team Members:</span> <span>{roleCounts["Team Member"]}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full max-w-5xl mt-10">
            <h2 className="text-2xl font-bold mb-4">Recent Projects</h2>
            <div className="bg-white rounded shadow overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-200 text-left">
                    <th className="p-2">Project Name</th>
                    <th className="p-2">Manager</th>
                    <th className="p-2">Leader</th>
                  </tr>
                </thead>
                <tbody>
                  {[...adminProjects].slice(-3).reverse().map(project => (
                    <tr key={project._id} className="border-t">
                      <td className="p-2">{project.name}</td>
                      <td className="p-2">{project.managerId?.name || "-"}</td>
                      <td className="p-2">{project.projectLeader?.name || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
