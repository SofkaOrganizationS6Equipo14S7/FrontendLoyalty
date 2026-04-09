import { render, screen } from '@testing-library/react';
import { UserRow } from '@/presentation/pages/users/UserRow';
import type { UserResponse } from '@/domain/types';

const user: UserResponse = {
  uid: 'u1',
  username: 'johndoe',
  email: 'john@example.com',
  roleName: 'STORE_ADMIN',
  isActive: true,
} as UserResponse;

function renderRow(props = {}) {
  return render(
    <table><tbody>
      <UserRow
        user={user}
        isMenuOpen={false}
        onMenuToggle={vi.fn()}
        onEdit={vi.fn()}
        onToggleActive={vi.fn()}
        onDelete={vi.fn()}
        {...props}
      />
    </tbody></table>,
  );
}

describe('UserRow', () => {
  it('renders username and email', () => {
    renderRow();
    expect(screen.getByText('johndoe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('renders role badge', () => {
    renderRow();
    expect(screen.getByText('STORE ADMIN')).toBeInTheDocument();
  });

  it('renders status badge', () => {
    renderRow();
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('shows "No email" when email is empty', () => {
    renderRow({ user: { ...user, email: '' } });
    expect(screen.getByText('No email')).toBeInTheDocument();
  });
});
