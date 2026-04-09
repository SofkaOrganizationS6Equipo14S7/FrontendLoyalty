import { render, screen } from '@testing-library/react';
import { RolesTable } from '@/presentation/pages/roles/RolesTable';
import type { RoleResponse } from '@/domain/types';

vi.mock('date-fns', () => ({ format: () => '2024-01-15' }));

const roles: RoleResponse[] = [
  { id: 'r1', name: 'SUPER_ADMIN', isActive: true, createdAt: '2024-01-15' } as RoleResponse,
];

describe('RolesTable', () => {
  const base = { roles, loading: false, onManagePermissions: vi.fn() };

  it('renders table with role data', () => {
    render(<RolesTable {...base} />);
    expect(screen.getByText('SUPER_ADMIN')).toBeInTheDocument();
  });

  it('renders headers', () => {
    render(<RolesTable {...base} />);
    expect(screen.getByText('Role')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('renders card title', () => {
    render(<RolesTable {...base} />);
    expect(screen.getByText('System Roles')).toBeInTheDocument();
  });

  it('renders loading spinner', () => {
    const { container } = render(<RolesTable {...base} loading={true} />);
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });
});
