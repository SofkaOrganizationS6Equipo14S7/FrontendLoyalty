import { render, screen } from '@testing-library/react';

vi.mock('date-fns', () => ({ format: () => '2024-01-15' }));

const mockUseRolesPermissions = vi.hoisted(() => vi.fn());
vi.mock('@/presentation/pages/roles/useRolesPermissions', () => ({
  useRolesPermissions: mockUseRolesPermissions,
}));

import { RolesPermissionsPage } from '@/presentation/pages/roles';

describe('RolesPermissionsPage', () => {
  const baseState = {
    roles: [],
    allPermissions: [],
    loading: false,
    modules: [],
    showAssign: false,
    setShowAssign: vi.fn(),
    selectedRole: null,
    selectedPermIds: [],
    saving: false,
    permSearch: '',
    setPermSearch: vi.fn(),
    openAssign: vi.fn(),
    handleSavePermissions: vi.fn(),
    togglePermission: vi.fn(),
  };

  it('renders page header', () => {
    mockUseRolesPermissions.mockReturnValue(baseState);
    render(<RolesPermissionsPage />);
    expect(screen.getByText('Roles & Permissions')).toBeInTheDocument();
  });

  it('renders roles table section', () => {
    mockUseRolesPermissions.mockReturnValue(baseState);
    render(<RolesPermissionsPage />);
    expect(screen.getByText('System Roles')).toBeInTheDocument();
  });

  it('renders permission modules grid', () => {
    mockUseRolesPermissions.mockReturnValue(baseState);
    render(<RolesPermissionsPage />);
    expect(screen.getByText('Permission Modules')).toBeInTheDocument();
  });
});
