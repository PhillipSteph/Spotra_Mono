import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  test('renders the main app container', () => {
    const { container } = render(<App />);
    const appElement = container.querySelector('.App');
    expect(appElement).toBeInTheDocument();
  });

  test('renders the app with correct class name', () => {
    const { container } = render(<App />);
    const appElement = container.querySelector('.App');
    expect(appElement).toHaveClass('App');
  });

  test('renders the header layout', () => {
    const { container } = render(<App />);
    const headerElement = container.querySelector('.header-layout');
    expect(headerElement).toBeInTheDocument();
  });

  test('app component mounts without errors', () => {
    const { container } = render(<App />);
    expect(container).toBeInTheDocument();
  });
});
