import { render, screen, within } from '@testing-library/react';
import App from './App';

const PATIENTS = [
  { id: 'p1', name: 'Asha Rao', age: 34, gender: 'female', dosha: 'vata_pitta', bmi: 22.4, condition: [], createdAt: { _seconds: 1760000000 } },
  { id: 'p2', name: 'Ravi Kumar', age: 41, gender: 'male', dosha: 'kapha', bmi: 27.1, condition: ['thyroid'], createdAt: { _seconds: 1750000000 } },
];
const SUMMARY = { p1: { generatedAt: '2026-10-01T00:00:00.000Z', status: 'active' } };

beforeEach(() => {
  global.fetch = (url) => {
    const data = url.endsWith('/ai-diet/summary') ? SUMMARY : PATIENTS;
    return Promise.resolve({ ok: true, json: () => Promise.resolve({ success: true, data }) });
  };
});

test('dashboard shows patient stats and recent patients from the API', async () => {
  render(<App />);

  expect(screen.getByRole('link', { name: 'Dashboard' })).toBeInTheDocument();

  const withPlanTile = (await screen.findByText('With a diet plan')).closest('div').parentElement;
  expect(within(withPlanTile).getByText('1')).toBeInTheDocument();

  expect(screen.getAllByText('Asha Rao').length).toBeGreaterThan(0);
  expect(screen.getAllByText('Vata-Pitta').length).toBeGreaterThan(0);
});
