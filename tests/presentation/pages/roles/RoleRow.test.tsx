import { render, screen } from '@testing-library/react';
import { RoleRow } from '@/presentation/pages/roles/RoleRow';
import type { RoleResponse } from '@/domain/types';

vi.mock('date-fns', () => ({ format: () => '2024-01-15' }));

const role: RoleResponse = {
  id: 'r1',
  name: 'STORE_ADMIN',
  isActive: true,
  createdAt: '2024-01-15T00:00:00Z',
} as RoleResponse;

function renderRow(props = {}) {
  return render(
    <table><tbody>
      <RoleRow role={role} onManagePermissions={vi.fn()} {...props} />
    </tbody></table>,
  );
}

describe('RoleRow', () => {
  it('renders role name', () => {
    renderRow();
    expect(screen.getByText('STORE_ADMIN')).toBeInTheDocument();
  });

  it('renders Active badge for active role', () => {
    renderRow();
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('renders Inactive badge for inactive role', () => {
    renderRow({ role: { ...role, isActive: false } });
    expect(screen.getByText('Inactive')).toBeInTheDocument();
  });

  it('renders Manage Permissions button', () => {
    renderRow();
    expect(screen.getByText('Manage Permissions')).toBeInTheDocument();
  });

  it('calls onManagePermissions on button click', () => {
    const onManage = vi.fn();
    renderRow({ onManagePermissions: onManage });
    screen.getByText('Manage Permissions').click();
    expect(onManage).toHaveBeenCalledWith(role);
  });
});
