const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const { history } = require('../db');

const router = express.Router();

// Get all history for user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const items = await history
      .find({ userId: req.userId })
      .sort({ createdAt: -1 });
    res.json(items);
  } catch {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// Get single item
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const item = await history.findOne({ _id: req.params.id, userId: req.userId });
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch {
    res.status(500).json({ error: 'Failed to fetch item' });
  }
});

// Delete item
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const removed = await history.remove({ _id: req.params.id, userId: req.userId });
    if (removed === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

module.exports = router;
