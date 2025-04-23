import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTask } from "../context/TaskContext";

const CompletedTasks = () => {
  const { user } = useAuth();
  const { tasks, fetchTasks } = useTask();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const completedTasks = tasks.filter((task) => task.status === "Completed");

  return (
    <div className="p-8 ml-64 text-white">
      <h1 className="text-3xl font-bold mb-4 text-black">Completed Tasks</h1>

      {completedTasks.length === 0 ? (
        <p className="text-gray-400">No completed tasks yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {completedTasks.map((task) => (
            <div key={task._id} className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold">{task.title}</h2>
              <p className="text-gray-300">{task.description}</p>
              <p className="text-sm">Deadline: {new Date(task.deadline).toLocaleDateString()}</p>
              <p className="text-sm">Status: {task.status}</p>
              <p className="text-sm">Progress: {task.progress}%</p>

              {/* View details only, no update allowed */}
              <p className="text-green-500 font-semibold mt-2">Task Submitted</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompletedTasks;
