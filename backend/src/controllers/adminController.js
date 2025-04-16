const User = require("../models/User");
const Project = require("../models/Project");
const Task = require("../models/Task");

const getAllProjects = async (req, res) => {
    try {
        if (req.user.role !== "Admin") return res.status(403).json({ message: "Access Denied" });
        const projects = await Project.find()
            .populate("managerId projectLeader", "name email")
            .select("-__v");
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: "Server Error", err });
    }
};

const getProjectDetails = async (req, res) => {
    try {
        if (req.user.role !== "Admin") return res.status(403).json({ message: "Access Denied" });

        const project = await Project.findById(req.params.projectId)
            .populate("managerId projectLeader", "name email");

        const tasks = await Task.find({ projectId: req.params.projectId }).populate("assignedTo", "name email");
        res.json({ project, tasks });
    } catch (err) {
        res.status(500).json({ message: "Server Error", err });
    }
};

const getAllUsers = async (req, res) => {
    try {
        if (req.user.role !== "Admin") return res.status(403).json({ message: "Access Denied" });
        const users = await User.find({ role: { $ne: "Admin" } }).select("name email role");
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "Server Error", err });
    }
};

const updateUserRole = async (req, res) => {
    try {
        if (req.user.role !== "Admin") return res.status(403).json({ message: "Access Denied" });

        const { userId, newRole } = req.body;

        const validRoles = ["Manager", "Project Leader", "Team Member"];
        if (!validRoles.includes(newRole)) {
            return res.status(400).json({ message: "Invalid role" });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.role = newRole;
        await user.save();

        res.json({ message: "User role updated", user });
    } catch (err) {
        res.status(500).json({ message: "Server Error", err });
    }
};

module.exports = { getAllProjects, getProjectDetails, getAllUsers, updateUserRole };
