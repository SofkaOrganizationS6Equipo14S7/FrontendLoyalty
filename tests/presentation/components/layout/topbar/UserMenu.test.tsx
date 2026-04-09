import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserMenu } from '@/presentation/components/layout/topbar/UserMenu';

const mockLogout = vi.fn();

vi.mock('@/infrastructure/store', () => ({
  useAuthStore: vi.fn(() => ({
    user: { username: 'admin', roleName: 'ADMIN' },
    logout: mockLogout,
  })),
}));

describe('UserMenu', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders user info', () => {
    render(<UserMenu />);
    expect(screen.getByText('admin')).toBeInTheDocument();
    expect(screen.getByText('ADMIN')).toBeInTheDocument();
  });

  it('renders sign out button', () => {
    render(<UserMenu />);
    expect(screen.getByText('Sign out')).toBeInTheDocument();
  });

  it('calls logout on sign out click', async () => {
    const user = userEvent.setup();
    render(<UserMenu />);
    await user.click(screen.getByText('Sign out'));
    expect(mockLogout).toHaveBeenCalled();
  });
});
