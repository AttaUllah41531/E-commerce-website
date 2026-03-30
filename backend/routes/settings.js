import express from "express";
import Settings from "../models/Settings.js";

const router = express.Router();

// GET settings (public info)
router.get("/", async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      // Create default settings if none exist
      settings = new Settings();
      await settings.save();
    }
    // Don't send ownerPassword to the frontend unless specifically requested/authorized
    const { ownerPassword, ...publicSettings } = settings.toObject();
    res.json(publicSettings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET sensitive settings (requires owner password or admin role)
router.get("/secure", async (req, res) => {
  try {
    const providedPassword = req.get('x-owner-password');
    const userRole = req.get('x-user-role')?.toLowerCase();
    
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
      await settings.save();
    }

    // Bypass if user is admin
    const isAdmin = ['admin', 'system admin'].includes(userRole);

    if (!isAdmin && providedPassword !== settings.ownerPassword) {
      return res.status(401).json({ message: "Invalid owner password" });
    }

    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE settings
router.put("/", async (req, res) => {
  try {
    const { currentPassword, ...updates } = req.body;
    const userRole = req.get('x-user-role')?.toLowerCase();
    console.log("SETTINGS UPDATE ATTEMPT - Role:", userRole, "Updates:", updates);
    
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
    }

    const isAdmin = ['admin', 'system admin'].includes(userRole);

    // Verify current password to allow updates (unless Admin)
    if (!isAdmin && currentPassword !== settings.ownerPassword) {
      console.log("UPDATE AUTH FAILED: IsAdmin:", isAdmin, "Provided Pwd:", currentPassword, "Stored Pwd:", settings.ownerPassword);
      return res.status(401).json({ message: "Current owner password incorrect" });
    }

    Object.assign(settings, updates);
    await settings.save();
    console.log("SETTINGS UPDATED SUCCESSFULLY");
    
    const { ownerPassword, ...publicSettings } = settings.toObject();
    res.json(publicSettings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
