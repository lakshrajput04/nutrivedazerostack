import { API_BASE } from '../config/api';

// Small fetch wrapper: returns parsed JSON and throws with the API's message on failure
export async function apiRequest(path, { method = 'GET', body } = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(result.message || `Request failed (${response.status})`);
  }
  return result;
}

export const getPatients = async () => (await apiRequest('/patients')).data || [];

// { [patientId]: { generatedAt, status } } for every patient that has a saved plan
export const getPlanSummary = async () => (await apiRequest('/ai-diet/summary')).data || {};
