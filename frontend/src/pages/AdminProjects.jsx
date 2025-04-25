import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";
import { useTheme } from "../context/ThemeContext";

const AdminProjects = () => {
  const { adminProjects, fetchAdminProjects } = useAdmin();
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  useEffect(() => {
    fetchAdminProjects();
  }, []);

  const handleViewDetails = (projectId) => {
    navigate(`/admin/project/${projectId}`);
  };

  return (
    <div className={`p-8 ml-64 min-h-screen transition-all duration-300 ${
      darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
    }`}>
      <h2 className="text-2xl font-bold mb-4">All Projects</h2>
      <div className="space-y-4">
        {adminProjects.map((project) => (
          <div
            key={project._id}
            className={`p-4 rounded shadow ${
              darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">{project.name}</h3>
                <p className={darkMode ? "text-gray-400" : "text-gray-500"}>
                  Manager: {project.managerId?.name}, Leader: {project.projectLeader?.name}
                </p>
              </div>
              <button
                onClick={() => handleViewDetails(project._id)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProjects;
