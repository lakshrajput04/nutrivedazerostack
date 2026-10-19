// Local development server. On Vercel the same app is served by api/index.js.
require('dotenv').config();
const app = require('./app');

const PORT = parseInt(process.env.PORT, 10) || 5000;

app.listen(PORT, () => {
  console.log(`🚀 NutriVeda API running on http://localhost:${PORT}/api/v1`);
});
