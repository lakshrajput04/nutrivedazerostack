const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');

// Get total patient count
router.get('/count', async (req, res) => {
  try {
    const count = await Patient.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
