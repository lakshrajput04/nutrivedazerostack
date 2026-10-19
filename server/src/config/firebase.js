const admin = require('firebase-admin');

const REQUIRED_ENV = ['FIREBASE_PROJECT_ID', 'FIREBASE_CLIENT_EMAIL', 'FIREBASE_PRIVATE_KEY'];

const getConfigStatus = () => {
  const missing = REQUIRED_ENV.filter(name => !process.env[name]);
  return { ok: missing.length === 0, missing };
};

// Initialize lazily so a missing env var produces a clear error per request
// instead of crashing the whole serverless function at import time.
const getApp = () => {
  if (admin.apps.length) return admin.app();

  const { ok, missing } = getConfigStatus();
  if (!ok) {
    throw new Error(`Firebase is not configured. Missing env vars: ${missing.join(', ')}`);
  }

  return admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // Env var UIs store the key with literal "\n" sequences
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    })
  });
};

const getDb = () => getApp().firestore();
const getAuth = () => getApp().auth();

module.exports = { admin, getDb, getAuth, getConfigStatus };
