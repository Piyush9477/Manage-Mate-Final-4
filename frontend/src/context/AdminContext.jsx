import { createContext, useContext, useState } from "react";

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [adminProjects, setAdminProjects] = useState([]);
  const [selectedProjectDetails, setSelectedProjectDetails] = useState(null);
  const [adminUsers, setAdminUsers] = useState([]);

  const apiUrl = "http://localhost:5001/admin";
  const token = localStorage.getItem("token");

  const fetchAdminProjects = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${apiUrl}/projects`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include"
      });
      const data = await res.json();
      setAdminProjects(data);
    } catch (error) {
      console.error("Error fetching admin projects:", error);
    }
  };

  const fetchAdminProjectDetails = async (projectId) => {
    if (!token) return;
    try {
      const res = await fetch(`${apiUrl}/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include"
      });
      const data = await res.json();
      setSelectedProjectDetails(data);
    } catch (error) {
      console.error("Error fetching project details:", error);
    }
  };

  const fetchAdminUsers = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${apiUrl}/users`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include"
      });
      const data = await res.json();
      setAdminUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    if (!token) return;
    try {
      const res = await fetch(`${apiUrl}/users/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ userId, newRole }),
      });

      const result = await res.json();
      if (res.ok) {
        await fetchAdminUsers();
        return { success: true, message: result.message };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error("Error updating user role:", error);
      return { success: false, message: error.message };
    }
  };

  return (
    <AdminContext.Provider
      value={{
        adminProjects,
        selectedProjectDetails,
        adminUsers,
        fetchAdminProjects,
        fetchAdminProjectDetails,
        fetchAdminUsers,
        updateUserRole,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
