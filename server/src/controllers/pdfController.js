const PDFService = require('../services/pdfService');
const Patient = require('../models/Patient');

class PDFController {
  // Generates the PDF and returns it directly in the response body
  static async generateDietPlanPDF(req, res) {
    try {
      const { patientId } = req.params;

      if (!patientId) {
        return res.status(400).json({
          success: false,
          message: 'Patient ID is required'
        });
      }

      // Get patient data
      const patient = await Patient.findById(patientId);
      if (!patient) {
        return res.status(404).json({
          success: false,
          message: 'Patient not found'
        });
      }

      const result = await PDFService.generateDietPlanPDF(patient);

      if (!result.success) {
        throw new Error('Failed to generate PDF');
      }

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${result.fileName}"`);
      res.setHeader('Content-Length', result.buffer.length);
      res.status(200).end(result.buffer);

    } catch (error) {
      console.error('PDF generation error:', error);
      res.status(500).json({
        success: false,
        message: `Error generating PDF: ${error.message}`
      });
    }
  }
}

module.exports = PDFController;
