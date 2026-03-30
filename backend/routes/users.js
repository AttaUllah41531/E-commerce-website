import express from "express";
import User from "../models/User.js";

const router = express.Router();

// Middleware to check for Admin role
const isAdmin = (req, res, next) => {
  const userRole = req.get('x-user-role')?.toLowerCase();
  if (!['admin', 'system admin'].includes(userRole)) {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};

// Get all users
router.get("/", isAdmin, async (req, res) => {
  try {
    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new user
router.post("/", isAdmin, async (req, res) => {
  try {
    const { username, password, fullName, role, status } = req.body;
    const user = new User({ username, password, fullName, role, status });
    await user.save();
    res.status(201).json({ message: "User created successfully", user: { id: user._id, username: user.username, role: user.role } });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update user details
router.put("/:id", isAdmin, async (req, res) => {
  try {
    const { username, password, fullName, role, status } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (username) user.username = username;
    if (fullName) user.fullName = fullName;
    if (role) user.role = role;
    if (status) user.status = status;
    if (password) user.password = password; // Will be hashed by pre-save hook

    await user.save();
    res.json({ message: "User updated successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete user
router.delete("/:id", isAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
