import { render, screen } from '@testing-library/react';
import { UserFormModal } from '@/presentation/pages/users/UserFormModal';
import type { EcommerceResponse, RoleResponse } from '@/domain/types';

const roles: RoleResponse[] = [
  { id: 'r1', name: 'STORE_ADMIN', isActive: true } as RoleResponse,
  { id: 'r2', name: 'SUPER_ADMIN', isActive: true } as RoleResponse,
];
const ecommerces: EcommerceResponse[] = [
  { uid: 'e1', name: 'Store A', status: 'ACTIVE' } as EcommerceResponse,
];
const form = { username: 'john', email: 'j@t.com', password: '123', roleId: 'r1', ecommerceId: 'e1' };

describe('UserFormModal', () => {
  const base = {
    isOpen: true,
    isEditing: false,
    form,
    ecommerces,
    roles,
    saving: false,
    onFormChange: vi.fn(),
    onSave: vi.fn(),
    onClose: vi.fn(),
  };

  it('renders Add New User title when not editing', () => {
    render(<UserFormModal {...base} />);
    expect(screen.getByText('Add New User')).toBeInTheDocument();
  });

  it('renders Edit User title when editing', () => {
    render(<UserFormModal {...base} isEditing={true} />);
    expect(screen.getByText('Edit User')).toBeInTheDocument();
  });

  it('renders name and email inputs', () => {
    render(<UserFormModal {...base} />);
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('renders password field when creating', () => {
    render(<UserFormModal {...base} />);
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('hides password field when editing', () => {
    render(<UserFormModal {...base} isEditing={true} />);
    expect(screen.queryByLabelText('Password')).not.toBeInTheDocument();
  });

  it('renders Send Invite button when creating', () => {
    render(<UserFormModal {...base} />);
    expect(screen.getByText('Send Invite')).toBeInTheDocument();
  });

  it('renders Save Changes button when editing', () => {
    render(<UserFormModal {...base} isEditing={true} />);
    expect(screen.getByText('Save Changes')).toBeInTheDocument();
  });

  it('renders store select for non-SUPER_ADMIN role', () => {
    render(<UserFormModal {...base} />);
    expect(screen.getByLabelText('Store')).toBeInTheDocument();
  });

  it('hides store select for SUPER_ADMIN role', () => {
    render(<UserFormModal {...base} form={{ ...form, roleId: 'r2' }} />);
    expect(screen.queryByLabelText('Store')).not.toBeInTheDocument();
  });

  it('calls onFormChange when name changes', async () => {
    const user = (await import('@testing-library/user-event')).default.setup();
    const onFormChange = vi.fn();
    render(<UserFormModal {...base} onFormChange={onFormChange} />);
    await user.type(screen.getByLabelText('Name'), 'x');
    expect(onFormChange).toHaveBeenCalled();
  });

  it('calls onFormChange when email changes', async () => {
    const user = (await import('@testing-library/user-event')).default.setup();
    const onFormChange = vi.fn();
    render(<UserFormModal {...base} onFormChange={onFormChange} />);
    await user.type(screen.getByLabelText('Email'), 'x');
    expect(onFormChange).toHaveBeenCalled();
  });

  it('calls onFormChange when password changes', async () => {
    const user = (await import('@testing-library/user-event')).default.setup();
    const onFormChange = vi.fn();
    render(<UserFormModal {...base} onFormChange={onFormChange} />);
    await user.type(screen.getByLabelText('Password'), 'x');
    expect(onFormChange).toHaveBeenCalled();
  });

  it('shows disabled role input when editing', () => {
    render(<UserFormModal {...base} isEditing={true} />);
    const roleInput = screen.getByLabelText('Role');
    expect(roleInput).toBeDisabled();
  });

  it('hides store select when no ecommerces', () => {
    render(<UserFormModal {...base} ecommerces={[]} />);
    expect(screen.queryByLabelText('Store')).not.toBeInTheDocument();
  });
});
