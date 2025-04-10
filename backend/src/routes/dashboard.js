const express = require("express");
const Project = require("../models/Project");
const Task = require("../models/Task");
const router = express.Router();
const { authMiddleware } = require("../middlewares/authMiddleware");

router.get("/stats", authMiddleware, async (req, res) => {
  try {
    const user = req.user;

    let totalProjects = 0;
    let totalTasks = 0;
    let pendingTasks = 0;
    let completedTasks = 0;
    let assignedProjects = 0;
    let assignedTasks = 0;

    if (user.role === "Manager") {
      // Get all projects created by this manager
      const projects = await Project.find({ managerId: user._id });

      totalProjects = projects.length;

      // Flatten all task arrays and count
      const allTaskIds = projects.flatMap(project => project.tasks);
      totalTasks = allTaskIds.length;

    } else if (user.role === "Project Leader") {
      assignedProjects = await Project.countDocuments({ projectLeader: user._id });
    } else if (user.role === "Team Member") {
      assignedTasks = await Task.countDocuments({ assignedTo: user._id });
      pendingTasks = await Task.countDocuments({ assignedTo: user.id, status: { $ne: "Completed" } });
      completedTasks = await Task.countDocuments({ assignedTo: user.id, status: "Completed" });
    }

    res.json({
      totalProjects,
      totalTasks,
      pendingTasks,
      completedTasks,
      assignedProjects,
      assignedTasks,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
