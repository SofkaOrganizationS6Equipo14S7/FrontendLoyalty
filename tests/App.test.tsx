import { render } from '@testing-library/react';

vi.mock('react-router-dom', () => ({
  RouterProvider: ({ router }: any) => <div data-testid="router-provider" />,
}));

vi.mock('react-hot-toast', () => ({
  Toaster: () => <div data-testid="toaster" />,
}));

vi.mock('@/presentation/router', () => ({
  router: {},
}));

import App from '@/App';

describe('App', () => {
  it('renders RouterProvider and Toaster', () => {
    const { getByTestId } = render(<App />);
    expect(getByTestId('router-provider')).toBeInTheDocument();
    expect(getByTestId('toaster')).toBeInTheDocument();
  });
});
