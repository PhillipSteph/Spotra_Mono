import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  test('renders the main app container', () => {
    render(<App />);
    const appElement = screen.getByRole('main');
    expect(appElement).toBeInTheDocument();
  });

  test('renders the app with correct class name', () => {
    render(<App />);
    const appElement = screen.getByRole('main');
    expect(appElement).toHaveClass('app');
  });

  test('app component mounts without errors', () => {
    const { container } = render(<App />);
    expect(container).toBeInTheDocument();
  });
});
