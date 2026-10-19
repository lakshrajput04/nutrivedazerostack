const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

// Import routes
const foodRoutes = require('./src/routes/food');
const recipeRoutes = require('./src/routes/recipe');
const patientRoutes = require('./src/routes/patient');
const patientRegistrationRoutes = require('./src/routes/patientRegistration');
const dietChartRoutes = require('./src/routes/dietChart');
const authRoutes = require('./src/routes/auth');
const pdfRoutes = require('./src/routes/pdf');
const aiDietRoutes = require('./src/routes/aiDiet');
const countsRoutes = require('./src/routes/counts');
const dietChartCountsRoutes = require('./src/routes/dietChartCounts');
const { getConfigStatus } = require('./src/config/firebase');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check - reports missing configuration without exposing values
app.get('/api/health', (req, res) => {
  const config = getConfigStatus();
  res.status(config.ok ? 200 : 503).json({
    success: config.ok,
    firebase: config.ok ? 'configured' : `missing: ${config.missing.join(', ')}`,
    gemini: process.env.GEMINI_API_KEY ? 'configured' : 'missing: GEMINI_API_KEY'
  });
});

// Base API route - provides information about available endpoints
app.get('/api/v1', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'NutriVeda API v1',
    version: '1.0.0',
    endpoints: {
      foods: '/api/v1/foods',
      recipes: '/api/v1/recipes',
      patients: '/api/v1/patients',
      patientRegistration: '/api/v1/patient-registration',
      dietCharts: '/api/v1/diet-charts',
      aiDiet: '/api/v1/ai-diet',
      auth: '/api/v1/auth',
      pdf: '/api/v1/pdf'
    }
  });
});

// Routes
app.use('/api/v1/foods', foodRoutes);
app.use('/api/v1/recipes', recipeRoutes);
app.use('/api/v1/patients', patientRoutes);
app.use('/api/v1/patient-registration', patientRegistrationRoutes);
app.use('/api/v1/diet-charts', dietChartRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/pdf', pdfRoutes);
app.use('/api/v1/ai-diet', aiDietRoutes);
app.use('/api/counts', countsRoutes);
app.use('/api/dietChartCounts', dietChartCountsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

module.exports = app;
