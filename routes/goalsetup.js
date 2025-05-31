const express = require('express');
const router = express.Router();
const Goal = require('../models/goal');
const { ensureSignedUp } = require('../middleware/auth');

// POST /goalsetup - Save one document with array of texts, associated with user
router.post('/goalsetup', ensureSignedUp, async (req, res) => {
  try {
    const { goals } = req.body; // expects array of strings
    if (!Array.isArray(goals)) {
      return res.status(400).json({ error: 'Goals must be an array of strings' });
    }
    const userId = req.session.userId;
    const newGoal = new Goal({ texts: goals, userId });
    const savedGoal = await newGoal.save();
    res.status(201).json(savedGoal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /goalsetup - Get all goals for logged-in user
router.get('/goalsetup', ensureSignedUp, async (req, res) => {
  try {
    const userId = req.session.userId;
    const goals = await Goal.find({ userId }).sort({ createdAt: -1 });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /goalsetup/:id - Delete a goal by id
router.delete('/goalsetup/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedGoal = await Goal.findByIdAndDelete(id);
    if (!deletedGoal) {
      return res.status(404).json({ error: 'Goal not found' });
    }
    res.json({ message: 'Goal deleted', id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
