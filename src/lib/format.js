// Doshas are stored as "vata", "vata_pitta" (new) or "vata-pitta" (older records)
export const formatDosha = (dosha) => {
  if (!dosha) return 'Unknown';
  return dosha
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('-');
};

const DOSHA_TONES = {
  vata: 'bg-sky-50 text-sky-800 ring-sky-200',
  pitta: 'bg-amber-50 text-amber-800 ring-amber-200',
  kapha: 'bg-teal-50 text-teal-800 ring-teal-200',
  tridoshic: 'bg-brand-50 text-brand-800 ring-brand-200',
};

// Combined doshas take the tone of their first element
export const doshaTone = (dosha) =>
  DOSHA_TONES[(dosha || '').split(/[-_]/)[0]] || 'bg-ink-100 text-ink-700 ring-ink-200';

// Firestore timestamps arrive as { _seconds } objects or ISO strings
export const toDate = (value) => {
  if (!value) return null;
  if (typeof value === 'object' && '_seconds' in value) return new Date(value._seconds * 1000);
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const formatDate = (value) => {
  const date = toDate(value);
  return date
    ? date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
    : '-';
};

export const formatBmi = (bmi) => (bmi ? Number(bmi).toFixed(1) : '-');

export const capitalize = (text) => (text ? text.charAt(0).toUpperCase() + text.slice(1) : '');
