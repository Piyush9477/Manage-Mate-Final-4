import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useTask } from "../context/TaskContext";
import { useTheme } from "../context/ThemeContext";

const UpdateTask = () => {
  const { taskId } = useParams(); 
  const { tasks, projectName, fetchProjectName, updateTask } = useTask();
  const navigate = useNavigate();
  const location = useLocation();
  const { from } = location.state || {};
  const { darkMode } = useTheme();
  
  const [task, setTask] = useState(null);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const selectedTask = tasks.find((t) => t._id === taskId);
    if (selectedTask) {
      setTask(selectedTask);
      setProgress(selectedTask.progress || 0); 
      fetchProjectName(selectedTask.projectId);
    }
  }, [tasks, taskId, fetchProjectName]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    const success = await updateTask(taskId, progress);
    if (success) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        navigate(from || "/my-tasks");
      }, 1000);
    }
  };

  if (!task) {
    return (
      <p className={`text-center ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
        Loading task...
      </p>
    );
  }

  return (
    <div
      className={`p-6 max-w-lg mx-auto rounded shadow transition-colors duration-300 ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
      }`}
    >
      <h2 className="text-2xl font-bold mb-4">Update {task.title}</h2>
      <p className={darkMode ? "text-gray-300 mb-2" : "text-gray-700 mb-2"}>{task.description}</p>
      <p className={darkMode ? "text-gray-300 mb-2" : "text-gray-700 mb-2"}>
        <strong>Project:</strong> {projectName}
      </p>
      <p className={darkMode ? "text-gray-300 mb-2" : "text-gray-700 mb-2"}>
        <strong>Status:</strong> {task.status}
      </p>

      {success && <p className="text-green-500 mb-4">Task updated successfully!</p>}

      <form onSubmit={handleUpdate}>
        <div className="mb-4">
          <label className={darkMode ? "block text-gray-300" : "block text-gray-700"}>
            Progress: {progress}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            className="w-full cursor-pointer"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Update Progress
        </button>
      </form>
    </div>
  );
};

export default UpdateTask;
