const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get total diet charts count
router.get('/count', async (req, res) => {
  try {
    const count = await db.countDocuments('aiDietCharts');
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
