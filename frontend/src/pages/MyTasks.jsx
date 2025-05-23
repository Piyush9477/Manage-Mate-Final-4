import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTask } from "../context/TaskContext";
import { useTheme } from "../context/ThemeContext";

const MyTasks = () => {
    const { user } = useAuth();
    const { tasks, fetchTasks, submitTask } = useTask();
    const location = useLocation();
    const { darkMode } = useTheme();

    useEffect(() => {
        if (user) {
            fetchTasks();
        }
    }, [user]);

    return (
        <div
            className={`p-8 ml-64 transition-all duration-300 ${
                darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
            }`}
        >
            <h1 className={`text-3xl font-bold mb-4 ${darkMode ? "text-white" : "text-black"}`}>
                Tasks
            </h1>

            {tasks.length === 0 ? (
                <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                    No tasks assigned yet.
                </p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tasks.map((task) => (
                        <div
                            key={task._id}
                            className={`p-6 rounded-lg shadow-lg transition-all ${
                                darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-black"
                            }`}
                        >
                            <h2 className="text-xl font-semibold">{task.title}</h2>
                            <p className={darkMode ? "text-gray-300" : "text-gray-700"}>
                                {task.description}
                            </p>
                            <p className="text-sm">
                                Deadline: {new Date(task.deadline).toLocaleDateString()}
                            </p>
                            <p className="text-sm">Status: {task.status}</p>
                            <p className="text-sm">Progress: {task.progress}</p>

                            {task.status !== "Completed" && (
                                <Link
                                    to={`/update-task/${task._id}`}
                                    state={{ from: location.pathname }}
                                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-yellow-700 mt-2 inline-block ml-2"
                                >
                                    Update Task Progress
                                </Link>
                            )}

                            {task.status !== "Completed" && task.progress > 0 && (
                                <button
                                    onClick={() => submitTask(task._id)}
                                    className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 transition mt-2 inline-block ml-2"
                                >
                                    Submit Task
                                </button>
                            )}

                            {task.status === "Completed" && (
                                <p className="text-green-500 font-semibold mt-2">
                                    Task Submitted
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyTasks;
