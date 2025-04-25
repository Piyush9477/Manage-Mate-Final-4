import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useTask } from "../context/TaskContext";
import { useTheme } from "../context/ThemeContext";

const ViewTasks = () => {
    const { user } = useAuth();
    const { tasksByProject, fetchTasksByProject } = useTask();
    const { darkMode } = useTheme();

    useEffect(() => {
        if (user) {
            fetchTasksByProject();
        }
    }, [user]);

    return (
        <div className={`p-6 ml-64 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
            <h2 className="text-2xl font-bold mb-4">Tasks List</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(tasksByProject).map(([projectId, project]) => (
                    <div
                        key={projectId}
                        className={`shadow rounded-lg p-4 ${darkMode ? "bg-gray-800" : "bg-white"}`}
                    >
                        <h3 className="text-lg font-bold mb-2">{project.projectName}</h3>
                        <ul className="list-disc list-inside">
                            {project.tasks.length > 0 ? (
                                project.tasks.map((task) => (
                                    <li
                                        key={task._id}
                                        className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}
                                    >
                                        {task.title} -{" "}
                                        <span className={`${darkMode ? "text-gray-400" : "text-gray-500"} text-sm`}>
                                            {task.status}
                                        </span>
                                    </li>
                                ))
                            ) : (
                                <p className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}>No tasks available</p>
                            )}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ViewTasks;
