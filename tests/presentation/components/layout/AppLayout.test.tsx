import { render, screen } from '@testing-library/react';

vi.mock('react-router-dom', () => ({
  Navigate: ({ to }: any) => <div data-testid="navigate" data-to={to} />,
  Outlet: () => <div data-testid="outlet" />,
}));

vi.mock('@/presentation/components/layout/sidebar', () => ({
  Sidebar: () => <div data-testid="sidebar" />,
}));

vi.mock('@/presentation/components/layout/topbar', () => ({
  TopBar: () => <div data-testid="topbar" />,
}));

const mockAuthStore = vi.hoisted(() => vi.fn());
const mockSidebarStore = vi.hoisted(() => vi.fn());

vi.mock('@/infrastructure/store', () => ({
  useAuthStore: mockAuthStore,
  useSidebarStore: mockSidebarStore,
}));

import { AppLayout } from '@/presentation/components/layout/AppLayout';

describe('AppLayout', () => {
  beforeEach(() => {
    mockSidebarStore.mockReturnValue({ setCollapsed: vi.fn() });
  });

  it('redirects to login when not authenticated', () => {
    mockAuthStore.mockReturnValue({
      isAuthenticated: false,
      user: null,
      isLoading: false,
      loadUser: vi.fn(),
    });
    render(<AppLayout />);
    expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/login');
  });

  it('shows loading spinner when loading', () => {
    mockAuthStore.mockReturnValue({
      isAuthenticated: true,
      user: null,
      isLoading: true,
      loadUser: vi.fn(),
    });
    render(<AppLayout />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders layout with sidebar, topbar, and outlet', () => {
    mockAuthStore.mockReturnValue({
      isAuthenticated: true,
      user: { username: 'admin', roleName: 'SUPER_ADMIN' },
      isLoading: false,
      loadUser: vi.fn(),
    });
    render(<AppLayout />);
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('topbar')).toBeInTheDocument();
    expect(screen.getByTestId('outlet')).toBeInTheDocument();
  });

  it('calls loadUser when authenticated but no user', () => {
    const loadUser = vi.fn();
    mockAuthStore.mockReturnValue({
      isAuthenticated: true,
      user: null,
      isLoading: false,
      loadUser,
    });
    render(<AppLayout />);
    expect(loadUser).toHaveBeenCalled();
  });
});
