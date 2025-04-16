const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/authMiddleware");
const { getAllProjects, getProjectDetails, getAllUsers, updateUserRole } = require("../controllers/adminController");

router.get("/projects", authMiddleware, getAllProjects);
router.get("/projects/:projectId", authMiddleware, getProjectDetails);
router.get("/users", authMiddleware, getAllUsers);
router.put("/users/role", authMiddleware, updateUserRole);

module.exports = router;
