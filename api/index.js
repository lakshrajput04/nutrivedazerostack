// Vercel serverless entry point. vercel.json rewrites every /api/* request here.
const app = require('../server/app');

module.exports = (req, res) => {
  // If the function sees the rewritten URL (/api?path=v1/patients) rather than the
  // original one, restore the original path so the Express routes match.
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname === '/api' && url.searchParams.has('path')) {
    const original = url.searchParams.get('path');
    url.searchParams.delete('path');
    const query = url.searchParams.toString();
    req.url = `/api/${original}${query ? `?${query}` : ''}`;
  }
  return app(req, res);
};
