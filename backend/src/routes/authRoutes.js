const express = require("express");
const {register, login, getProfile, editProfile, logout, getAllUsers} = require("../controllers/authController");
const {authMiddleware} = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");
const router = express.Router();
const User = require("../models/User")

router.post("/register", upload.single("profilePicture"), register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/profile", authMiddleware, getProfile);
router.put("/profile/edit", authMiddleware, upload.single("profilePicture"), editProfile);
router.get("/allUsers", authMiddleware, getAllUsers);

// Fetch logged-in user details
router.get("/me", authMiddleware, async (req, res) => {
    try {
        res.json(req.user);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// Fetch all users (Required for chat)
router.get("/users", authMiddleware, async (req, res) => {
    try {
        const users = await User.find().select("name _id role profilePicture");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
});

module.exports = router;