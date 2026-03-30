import express from 'express';
const router = express.Router();
import CashSession from '../models/CashSession.js';

// Get current open session
router.get('/current', async (req, res) => {
  try {
    const session = await CashSession.findOne({ status: 'open' });
    res.json(session);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Start a new session
router.post('/start', async (req, res) => {
  const { openingCash, cashierId } = req.body;
  
  try {
    // Check if there's already an open session
    const existing = await CashSession.findOne({ status: 'open' });
    if (existing) {
      return res.status(400).json({ message: 'A session is already open' });
    }

    const session = new CashSession({
      openingCash,
      cashierId,
      status: 'open',
      expectedCash: openingCash
    });

    const newSession = await session.save();
    res.status(201).json(newSession);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// End current session
router.post('/end', async (req, res) => {
  const { actualCash, notes, userId } = req.body;
  
  try {
    const session = await CashSession.findOne({ status: 'open' });
    if (!session) {
      return res.status(404).json({ message: 'No open session found' });
    }

    session.actualCash = actualCash;
    session.closingCash = actualCash;
    session.endTime = Date.now();
    session.status = 'closed';
    session.notes = notes;
    session.closedBy = userId;

    const updatedSession = await session.save();
    res.json(updatedSession);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get session history
router.get('/history', async (req, res) => {
  try {
    const sessions = await CashSession.find()
      .populate('cashierId', 'fullName role')
      .populate('closedBy', 'fullName role')
      .sort({ startTime: -1 })
      .limit(30);
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
