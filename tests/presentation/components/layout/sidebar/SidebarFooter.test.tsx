import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { SidebarFooter } from '@/presentation/components/layout/sidebar/SidebarFooter';

const mockSetOpen = vi.fn();
const mockSetCollapsed = vi.fn();
let mockCollapsed = false;

vi.mock('@/infrastructure/store', () => ({
  useSidebarStore: vi.fn(() => ({
    isCollapsed: mockCollapsed,
    setOpen: mockSetOpen,
    setCollapsed: mockSetCollapsed,
  })),
}));

describe('SidebarFooter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCollapsed = false;
  });

  it('renders Settings link', () => {
    render(<MemoryRouter><SidebarFooter /></MemoryRouter>);
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('hides Settings text when collapsed', () => {
    mockCollapsed = true;
    render(<MemoryRouter><SidebarFooter /></MemoryRouter>);
    expect(screen.queryByText('Settings')).toBeNull();
  });

  it('Settings link points to /settings', () => {
    render(<MemoryRouter><SidebarFooter /></MemoryRouter>);
    const link = screen.getByText('Settings').closest('a');
    expect(link?.getAttribute('href')).toBe('/settings');
  });

  it('renders collapse toggle button', () => {
    render(<MemoryRouter><SidebarFooter /></MemoryRouter>);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });
});
