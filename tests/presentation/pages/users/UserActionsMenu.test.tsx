import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserActionsMenu } from '@/presentation/pages/users/UserActionsMenu';
import type { UserResponse } from '@/domain/types';

const user: UserResponse = {
  uid: 'u1',
  username: 'john',
  email: 'john@test.com',
  roleName: 'STORE_ADMIN',
  isActive: true,
} as UserResponse;

describe('UserActionsMenu', () => {
  const base = {
    user,
    isOpen: false,
    onToggle: vi.fn(),
    onEdit: vi.fn(),
    onToggleActive: vi.fn(),
    onDelete: vi.fn(),
  };

  it('renders toggle button', () => {
    render(<UserActionsMenu {...base} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('does not show menu when closed', () => {
    render(<UserActionsMenu {...base} />);
    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
  });

  it('shows menu when open', () => {
    render(<UserActionsMenu {...base} isOpen={true} />);
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Deactivate')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('shows Activate for inactive user', () => {
    render(<UserActionsMenu {...base} isOpen={true} user={{ ...user, isActive: false }} />);
    expect(screen.getByText('Activate')).toBeInTheDocument();
  });

  it('calls onEdit on Edit click', async () => {
    const u = userEvent.setup();
    const onEdit = vi.fn();
    render(<UserActionsMenu {...base} isOpen={true} onEdit={onEdit} />);
    await u.click(screen.getByText('Edit'));
    expect(onEdit).toHaveBeenCalled();
  });

  it('calls onDelete on Delete click', async () => {
    const u = userEvent.setup();
    const onDelete = vi.fn();
    render(<UserActionsMenu {...base} isOpen={true} onDelete={onDelete} />);
    await u.click(screen.getByText('Delete'));
    expect(onDelete).toHaveBeenCalled();
  });
});
