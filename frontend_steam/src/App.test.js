import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the Steam-like header', () => {
  render(<App />);
  expect(screen.getByText(/steam store management/i)).toBeInTheDocument();
});
