import { useEffect, useState } from 'react';
import { getPatients, getPlanSummary } from './api';
import { toDate } from './format';

// Loads all patients (newest first) plus which of them have a saved diet plan
export default function usePatientsData() {
  const [state, setState] = useState({ patients: [], plans: {}, loading: true, error: '' });

  useEffect(() => {
    let cancelled = false;
    Promise.all([getPatients(), getPlanSummary()])
      .then(([patients, plans]) => {
        if (cancelled) return;
        const sorted = [...patients].sort((a, b) => (toDate(b.createdAt) || 0) - (toDate(a.createdAt) || 0));
        setState({ patients: sorted, plans, loading: false, error: '' });
      })
      .catch((error) => {
        if (!cancelled) setState({ patients: [], plans: {}, loading: false, error: error.message });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
