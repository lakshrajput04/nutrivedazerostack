// The API is served from the same origin (/api on Vercel, CRA proxy locally).
// Set REACT_APP_API_URL only to point the frontend at a different host.
export const API_URL = process.env.REACT_APP_API_URL || '';
export const API_BASE = `${API_URL}/api/v1`;
