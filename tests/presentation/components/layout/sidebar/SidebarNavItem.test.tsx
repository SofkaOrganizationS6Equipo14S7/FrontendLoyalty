import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SidebarNavItem } from '@/presentation/components/layout/sidebar/SidebarNavItem';
import { Home } from 'lucide-react';
import type { NavItem } from '@/presentation/components/layout/navigation.config';

const item: NavItem = { name: 'Dashboard', href: '/dashboard', icon: Home };

describe('SidebarNavItem', () => {
  it('renders item name when expanded', () => {
    render(
      <MemoryRouter>
        <SidebarNavItem item={item} isActive={false} isCollapsed={false} />
      </MemoryRouter>
    );
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('hides name when collapsed', () => {
    render(
      <MemoryRouter>
        <SidebarNavItem item={item} isActive={false} isCollapsed={true} />
      </MemoryRouter>
    );
    expect(screen.queryByText('Dashboard')).toBeNull();
  });

  it('applies active styles', () => {
    render(
      <MemoryRouter>
        <SidebarNavItem item={item} isActive={true} isCollapsed={false} />
      </MemoryRouter>
    );
    const link = screen.getByText('Dashboard').closest('a');
    expect(link?.className).toContain('bg-indigo-50');
  });

  it('sets title when collapsed', () => {
    render(
      <MemoryRouter>
        <SidebarNavItem item={item} isActive={false} isCollapsed={true} />
      </MemoryRouter>
    );
    const link = document.querySelector('a');
    expect(link?.title).toBe('Dashboard');
  });

  it('renders link to correct href', () => {
    render(
      <MemoryRouter>
        <SidebarNavItem item={item} isActive={false} isCollapsed={false} />
      </MemoryRouter>
    );
    const link = screen.getByText('Dashboard').closest('a');
    expect(link?.getAttribute('href')).toBe('/dashboard');
  });
});
