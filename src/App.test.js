import { render, screen } from '@testing-library/react';
import App from './App';

// axios ships ESM that CRA's Jest can't transform; the counters only need get().
// A plain function, because CRA's resetMocks would clear a jest.fn implementation.
jest.mock('axios', () => ({
  get: () => Promise.resolve({ data: { count: 3 } })
}));

test('renders the dashboard with stats from the API', async () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: 'NutriVeda' })).toBeInTheDocument();
  expect(await screen.findAllByText('3')).toHaveLength(2);
});
