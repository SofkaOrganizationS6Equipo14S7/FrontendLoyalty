import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('react-router-dom', () => ({
  Navigate: ({ to }: any) => <div data-testid="navigate">{to}</div>,
}));

const mockLogin = vi.fn();
vi.mock('@/infrastructure/store', () => ({
  useAuthStore: vi.fn(() => ({
    login: mockLogin,
    isAuthenticated: false,
  })),
}));

vi.mock('@/lib/utils', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getApiErrorMessage: (_err: unknown, fallback: string) => fallback,
  };
});

import { LoginPage } from '@/presentation/pages/login';
import { useAuthStore } from '@/infrastructure/store';

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuthStore).mockReturnValue({
      login: mockLogin,
      isAuthenticated: false,
    } as any);
  });

  it('renders login form when not authenticated', () => {
    render(<LoginPage />);
    expect(screen.getByText('LoyaltyEngine')).toBeInTheDocument();
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
  });

  it('redirects to dashboard when authenticated', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      login: mockLogin,
      isAuthenticated: true,
    } as any);
    render(<LoginPage />);
    expect(screen.getByTestId('navigate')).toHaveTextContent('/dashboard');
  });

  it('calls login on form submit', async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValue(undefined);
    render(<LoginPage />);
    await user.type(screen.getByLabelText('Username'), 'admin');
    await user.type(screen.getByLabelText('Password'), 'pass123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    await waitFor(() => expect(mockLogin).toHaveBeenCalledWith('admin', 'pass123'));
  });

  it('shows error on failed login', async () => {
    const user = userEvent.setup();
    mockLogin.mockRejectedValue(new Error('Bad'));
    render(<LoginPage />);
    await user.type(screen.getByLabelText('Username'), 'admin');
    await user.type(screen.getByLabelText('Password'), 'wrong');
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    await waitFor(() => expect(screen.getByText('Invalid credentials')).toBeInTheDocument());
  });
});
