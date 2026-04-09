import { render, screen, fireEvent } from '@testing-library/react';
import { PermissionAssignModal } from '@/presentation/pages/roles/PermissionAssignModal';

describe('PermissionAssignModal', () => {
  const allPermissions = [
    { id: 'p1', code: 'READ_USERS', description: 'Read users', module: 'USERS' },
    { id: 'p2', code: 'WRITE_USERS', description: 'Write users', module: 'USERS' },
    { id: 'p3', code: 'READ_STORES', description: 'Read stores', module: 'STORES' },
  ];

  const defaultProps = {
    isOpen: true,
    selectedRole: { id: 'r1', name: 'Admin', permissions: [] } as any,
    allPermissions,
    selectedPermIds: ['p1'],
    modules: ['USERS', 'STORES'],
    permSearch: '',
    saving: false,
    onClose: vi.fn(),
    onSearchChange: vi.fn(),
    onTogglePermission: vi.fn(),
    onSave: vi.fn(),
  };

  it('renders modal title with role name', () => {
    render(<PermissionAssignModal {...defaultProps} />);
    expect(screen.getByText('Permissions — Admin')).toBeInTheDocument();
  });

  it('renders search input', () => {
    render(<PermissionAssignModal {...defaultProps} />);
    expect(screen.getByPlaceholderText('Search permissions...')).toBeInTheDocument();
  });

  it('renders module headings', () => {
    render(<PermissionAssignModal {...defaultProps} />);
    expect(screen.getByText('USERS')).toBeInTheDocument();
    expect(screen.getByText('STORES')).toBeInTheDocument();
  });

  it('renders permissions', () => {
    render(<PermissionAssignModal {...defaultProps} />);
    expect(screen.getByText('Read users')).toBeInTheDocument();
    expect(screen.getByText('Read stores')).toBeInTheDocument();
  });

  it('shows permission count', () => {
    render(<PermissionAssignModal {...defaultProps} />);
    expect(screen.getByText('1 of 3 selected')).toBeInTheDocument();
  });

  it('calls onSearchChange when typing', () => {
    render(<PermissionAssignModal {...defaultProps} />);
    fireEvent.change(screen.getByPlaceholderText('Search permissions...'), {
      target: { value: 'READ' },
    });
    expect(defaultProps.onSearchChange).toHaveBeenCalledWith('READ');
  });

  it('calls onSave when clicking Save Permissions', () => {
    render(<PermissionAssignModal {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /Save Permissions/ }));
    expect(defaultProps.onSave).toHaveBeenCalled();
  });

  it('filters permissions by search', () => {
    render(<PermissionAssignModal {...defaultProps} permSearch="stores" />);
    expect(screen.queryByText('Read users')).not.toBeInTheDocument();
    expect(screen.getByText('Read stores')).toBeInTheDocument();
  });
});
