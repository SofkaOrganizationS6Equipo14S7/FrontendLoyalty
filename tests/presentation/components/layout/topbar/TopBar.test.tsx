import { render, screen } from '@testing-library/react';

vi.mock('react-router-dom', () => ({
  useLocation: () => ({ pathname: '/dashboard' }),
}));

const mockSidebarStore = vi.hoisted(() => vi.fn());

vi.mock('@/infrastructure/store', () => ({
  useSidebarStore: mockSidebarStore,
}));

vi.mock('@/presentation/components/layout/topbar/ThemeToggle', () => ({
  ThemeToggle: () => <div data-testid="theme-toggle" />,
}));

vi.mock('@/presentation/components/layout/topbar/UserMenu', () => ({
  UserMenu: () => <div data-testid="user-menu" />,
}));

import { TopBar } from '@/presentation/components/layout/topbar/TopBar';

describe('TopBar', () => {
  beforeEach(() => {
    mockSidebarStore.mockReturnValue({ setOpen: vi.fn() });
  });

  it('renders page title based on location', () => {
    render(<TopBar />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('renders theme toggle', () => {
    render(<TopBar />);
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
  });

  it('renders user menu', () => {
    render(<TopBar />);
    expect(screen.getByTestId('user-menu')).toBeInTheDocument();
  });

  it('renders mobile menu button', () => {
    render(<TopBar />);
    expect(screen.getByText('Open sidebar')).toBeInTheDocument();
  });
});
