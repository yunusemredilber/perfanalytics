import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders title', () => {
  const { getByText } = render(<App />);
  const label = getByText(/Perfanalytics Dashboard/i);
  expect(label).toBeInTheDocument();
});
