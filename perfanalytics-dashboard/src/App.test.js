import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders dark mode label', () => {
  const { getByText } = render(<App />);
  const label = getByText(/Dark Mode/i);
  expect(label).toBeInTheDocument();
});
