const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: {type: String, enum: ["Admin", "Manager", "Project Leader", "Team Member"], required: true},
    assignedProject: [{type: mongoose.Schema.Types.ObjectId, ref: "Project"}],
    profilePicture: { type: String, default: "" }
}, {timestamps: true});

module.exports = mongoose.model("User", userSchema);