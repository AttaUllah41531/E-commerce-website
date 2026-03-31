import express from "express";
import User from "../models/User.js";

const router = express.Router();

// Get Current User (via cookie)
router.get("/me", async (req, res) => {
  try {
    const userId = req.cookies.nexflow_sess;
    if (!userId) return res.status(401).json({ message: "Not authenticated" });

    const user = await User.findById(userId);
    if (!user || user.status !== 'active') {
      res.clearCookie('nexflow_sess');
      return res.status(401).json({ message: "Session invalid or account inactive" });
    }

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

    // Set persistence cookie (HTTP-only)
    res.cookie('nexflow_sess', user._id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

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

// Logout
router.post("/logout", (req, res) => {
  res.clearCookie('nexflow_sess');
  res.json({ message: "Logged out successfully" });
});

export default router;

