import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SidebarHeader } from '@/presentation/components/layout/sidebar/SidebarHeader';

const mockSetOpen = vi.fn();
let mockCollapsed = false;

vi.mock('@/infrastructure/store', () => ({
  useSidebarStore: vi.fn(() => ({
    isCollapsed: mockCollapsed,
    setOpen: mockSetOpen,
  })),
}));

describe('SidebarHeader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCollapsed = false;
  });

  it('renders app name when expanded', () => {
    render(<SidebarHeader />);
    expect(screen.getByText('LoyaltyEngine')).toBeInTheDocument();
  });

  it('hides app name when collapsed', () => {
    mockCollapsed = true;
    render(<SidebarHeader />);
    expect(screen.queryByText('LoyaltyEngine')).toBeNull();
  });

  it('calls setOpen(false) on close button click', async () => {
    const user = userEvent.setup();
    render(<SidebarHeader />);
    const closeBtn = screen.getByRole('button');
    await user.click(closeBtn);
    expect(mockSetOpen).toHaveBeenCalledWith(false);
  });
});
