import { describe, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './../App'

vi.mock('./../services/index', () => ({
  getProducts: vi.fn(() => Promise.resolve({ data: [] }))
}));

describe('App', () => {
  test('renders App component', () => {
    render(<App />);
    screen.debug();
  });
});

