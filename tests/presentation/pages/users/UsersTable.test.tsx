import { render, screen } from '@testing-library/react';
import { UsersTable } from '@/presentation/pages/users/UsersTable';
import type { UserResponse } from '@/domain/types';

const user: UserResponse = {
  uid: 'u1',
  username: 'johndoe',
  email: 'john@example.com',
  roleName: 'STORE_ADMIN',
  isActive: true,
} as UserResponse;

describe('UsersTable', () => {
  const base = {
    users: [user],
    loading: false,
    pageSize: 5,
    onEdit: vi.fn(),
    onToggleActive: vi.fn(),
    onDelete: vi.fn(),
  };

  it('renders table headers', () => {
    render(<UsersTable {...base} />);
    expect(screen.getByText('User')).toBeInTheDocument();
    expect(screen.getByText('Role')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('renders user data', () => {
    render(<UsersTable {...base} />);
    expect(screen.getByText('johndoe')).toBeInTheDocument();
  });

  it('renders loading skeletons', () => {
    const { container } = render(<UsersTable {...base} loading={true} />);
    expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0);
  });

  it('renders empty state when no users', () => {
    render(<UsersTable {...base} users={[]} />);
    expect(screen.getByText('No users found.')).toBeInTheDocument();
  });

  it('renders multiple users', () => {
    const users = [
      user,
      { uid: 'u2', username: 'janedoe', email: 'jane@example.com', roleName: 'STORE_USER', isActive: false } as UserResponse,
    ];
    render(<UsersTable {...base} users={users} />);
    expect(screen.getByText('johndoe')).toBeInTheDocument();
    expect(screen.getByText('janedoe')).toBeInTheDocument();
  });
});
