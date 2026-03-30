import express from "express";
import User from "../models/User.js";

const router = express.Router();

// Get all users (Admin only)
router.get("/", async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new user (Admin only)
router.post("/", async (req, res) => {
  try {
    const { username, password, fullName, role } = req.body;
    const user = new User({ username, password, fullName, role });
    await user.save();
    res.status(201).json({ message: "User created successfully", user: { id: user._id, username: user.username, role: user.role } });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete user
router.delete("/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
