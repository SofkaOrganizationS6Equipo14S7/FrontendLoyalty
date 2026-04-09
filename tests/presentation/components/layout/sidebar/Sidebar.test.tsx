import { render, screen, fireEvent } from '@testing-library/react';

vi.mock('react-router-dom', () => ({
  useLocation: () => ({ pathname: '/dashboard' }),
  NavLink: ({ children, to, ...props }: any) => <a href={to} {...props}>{children}</a>,
}));

const mockAuthStore = vi.hoisted(() => vi.fn());
const mockSidebarStore = vi.hoisted(() => vi.fn());

vi.mock('@/infrastructure/store', () => ({
  useAuthStore: mockAuthStore,
  useSidebarStore: mockSidebarStore,
}));

vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

import { Sidebar } from '@/presentation/components/layout/sidebar/Sidebar';

describe('Sidebar', () => {
  const setOpen = vi.fn();

  beforeEach(() => {
    mockAuthStore.mockReturnValue({
      user: { username: 'admin', roleName: 'SUPER_ADMIN' },
    });
    mockSidebarStore.mockReturnValue({
      isOpen: false,
      isCollapsed: false,
      setOpen,
      setCollapsed: vi.fn(),
    });
  });

  it('renders navigation items', () => {
    render(<Sidebar />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('renders LoyaltyEngine brand', () => {
    render(<Sidebar />);
    expect(screen.getByText('LoyaltyEngine')).toBeInTheDocument();
  });

  it('renders settings link in footer', () => {
    render(<Sidebar />);
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('shows mobile overlay when isOpen is true', () => {
    mockSidebarStore.mockReturnValue({
      isOpen: true,
      isCollapsed: false,
      setOpen,
      setCollapsed: vi.fn(),
    });
    const { container } = render(<Sidebar />);
    const overlay = container.querySelector('.fixed.inset-0');
    expect(overlay).toBeInTheDocument();
  });

  it('clicking overlay closes sidebar', () => {
    mockSidebarStore.mockReturnValue({
      isOpen: true,
      isCollapsed: false,
      setOpen,
      setCollapsed: vi.fn(),
    });
    const { container } = render(<Sidebar />);
    const overlay = container.querySelector('.fixed.inset-0');
    fireEvent.click(overlay!);
    expect(setOpen).toHaveBeenCalledWith(false);
  });

  it('filters nav items by role', () => {
    mockAuthStore.mockReturnValue({
      user: { username: 'viewer', roleName: 'VIEWER' },
    });
    render(<Sidebar />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    // Stores requires SUPER_ADMIN
    expect(screen.queryByText('Stores')).not.toBeInTheDocument();
  });
});
