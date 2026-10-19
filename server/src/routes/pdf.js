const express = require('express');
const PDFController = require('../controllers/pdfController');

const router = express.Router();

// PDF routes
router.post('/generate/:patientId', PDFController.generateDietPlanPDF);

// PDF info endpoint
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'PDF Generation API',
    endpoints: {
      generate: 'POST /api/v1/pdf/generate/:patientId - Generate and download diet plan PDF'
    }
  });
});

module.exports = router;
