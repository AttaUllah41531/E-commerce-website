import express from "express";
import User from "../models/User.js";

const router = express.Router();

// Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    if (user.status !== 'active') {
      return res.status(403).json({ message: "Account is inactive" });
    }

    user.lastLogged = new Date();
    await user.save();

    res.json({
      id: user._id,
      username: user.username,
      fullName: user.fullName,
      role: user.role
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
