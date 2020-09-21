import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders ttfb chart title', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/TTFB/i);
  expect(linkElement).toBeInTheDocument();
});
