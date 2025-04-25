import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useProject } from "../context/ProjectContext";
import { useTheme } from "../context/ThemeContext"; // Import ThemeContext

const ProjectList = () => {
  const { user } = useAuth();
  const { projects, fetchProjects, updateProjectStatus } = useProject();
  const { darkMode } = useTheme(); // Get darkMode state
  const [selectedProject, setSelectedProject] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState("");

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  return (
    <div
      className={`p-8 ml-64 transition-all duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <h1 className="text-3xl font-bold mb-4">Projects</h1>

      {user?.role === "Manager" && (
        <Link
          to="/add-project"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition mb-4 inline-block"
        >
          + Add Project
        </Link>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.length === 0 ? (
          <p className={`transition-colors ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            No projects assigned yet.
          </p>
        ) : (
          projects.map((project) => (
            <div
              key={project._id}
              className={`p-4 rounded-lg shadow-lg transition-all ${
                darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-black"
              }`}
            >
              <h2 className="text-xl font-semibold">{project.name}</h2>
              <p className={`transition-colors ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                {project.description}
              </p>

              {user?.role === "Project Leader" ? (
                <p className="text-sm mt-2">
                  <strong>Assigned by:</strong> {project.managerId?.name}
                </p>
              ) : user?.role === "Manager" ? (
                <p className="text-sm mt-2">
                  <strong>Assigned to:</strong> {project.projectLeader?.name}
                </p>
              ) : null}

              <p className="text-sm">
                <strong>Deadline:</strong> {new Date(project.deadline).toLocaleDateString()}
              </p>
              <p className="text-sm">
                <strong>Status:</strong> {project.status}
              </p>
              <p className="text-sm"><strong>Attached Documents: </strong>{project.files?.length ?? 0}</p>

              {/* Show "Edit Project" button only for Managers */}
              {user?.role === "Manager" && (
                <Link
                  to={`/edit-project/${project._id}`}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700 transition mt-2 inline-block"
                  onClick={() => console.log("Project ID:", project._id)}
                >
                  Edit
                </Link>
              )}

              {/* Show "Create Task", "View Tasks" and "Update Status" only for Team Leaders */}
              {user?.role === "Project Leader" && (
                <>
                  <Link
                    to={`/add-task/${project._id}`}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-700 transition mt-2 inline-block ml-2"
                  >
                    Create Task
                  </Link>
                  <Link
                    to={`/tasks/${project._id}`}
                    className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-700 transition mt-2 inline-block ml-2"
                  >
                    View Tasks
                  </Link>
                  <button
                    onClick={() => {
                      setSelectedProject(project);
                      setStatusUpdate(project.status);
                      setShowStatusModal(true);
                    }}
                    className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-700 transition mt-2 inline-block ml-2"
                  >
                    Update Status
                  </button>
                </>
              )}

              <Link
                to="/detailed-project"
                state={project._id}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700 transition mt-2 inline-block ml-2"
              >
                View Details
              </Link>
            </div>
          ))
        )}
      </div>

      {/* Show Status Modal */}
      {showStatusModal && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div
            className={`rounded-lg shadow-lg p-6 w-full max-w-lg transition-all ${
              darkMode ? "bg-gray-800 text-white" : "bg-gray-200 text-black"
            }`}
          >
            <h2 className="text-2xl font-bold mb-4">Update Project Status</h2>
            <p><strong>Name:</strong> {selectedProject.name}</p>
            <p><strong>Description:</strong> {selectedProject.description}</p>
            <p><strong>Deadline:</strong> {new Date(selectedProject.deadline).toLocaleDateString()}</p>
            <p><strong>Status:</strong></p>
            <select
              value={statusUpdate}
              onChange={(e) => setStatusUpdate(e.target.value)}
              className={`p-2 rounded border w-full my-2 ${
                darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-black border-gray-300"
              }`}
            >
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>

            <div className="flex justify-end space-x-4 mt-4">
              <button
                onClick={async () => {
                  const success = await updateProjectStatus(selectedProject._id, statusUpdate);
                  if (success) setShowStatusModal(false);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>
              <button
                onClick={() => setShowStatusModal(false)}
                className={`px-4 py-2 rounded ${
                  darkMode ? "bg-gray-600 text-white" : "bg-gray-400 text-white"
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectList;
