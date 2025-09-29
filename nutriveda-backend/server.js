const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

// Import database for connection test
const db = require('./src/config/database');

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

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      scriptSrcAttr: ["'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
}));
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files (for the HTML form)
app.use('/public', express.static('public'));

// Test database connection on startup
async function initializeServer() {
  console.log('🚀 Initializing NutriVeda Backend...');
  const dbConnected = await db.testConnection();
  if (!dbConnected) {
    console.error('❌ Failed to connect to database');
    process.exit(1);
  }
}

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
      auth: '/api/v1/auth',
      pdf: '/api/v1/pdf'
    },
    documentation: 'Visit individual endpoints for available operations',
    registrationForm: '/public/registration.html'
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
app.use('*', (req, res) => {
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

// Start server with port fallback
const startServer = async (port) => {
  // Ensure port is a number and within valid range
  port = parseInt(port);
  if (isNaN(port) || port < 0 || port >= 65536) {
    port = 5000; // Reset to default if invalid
  }

  try {
    await initializeServer();
    await new Promise((resolve, reject) => {
      const server = app.listen(port)
        .once('error', (err) => {
          if (err.code === 'EADDRINUSE') {
            console.log(`⚠️ Port ${port} is busy, trying port ${port + 1}...`);
            server.close();
            resolve(startServer(port + 1));
          } else {
            reject(err);
          }
        })
        .once('listening', () => {
          console.log(`🚀 NutriVeda Backend running on port ${port}`);
          console.log(`📊 Environment: ${process.env.NODE_ENV}`);
          console.log(` API Base URL: http://localhost:${port}/api/v1`);
          resolve();
        });
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer(PORT);

module.exports = app;