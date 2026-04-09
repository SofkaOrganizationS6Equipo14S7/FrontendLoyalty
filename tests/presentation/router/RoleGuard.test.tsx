import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { RoleGuard } from '@/presentation/router/RoleGuard';
import { useAuthStore } from '@/infrastructure/store/auth.store';
import type { UserResponse } from '@/domain/types';

const mockSuperAdmin: UserResponse = {
  uid: 'u1', username: 'admin', roleId: 'r1', roleName: 'SUPER_ADMIN',
  email: 'a@t.com', ecommerceId: null, isActive: true,
  createdAt: '2024-01-01', updatedAt: '2024-01-01',
};

const mockStoreUser: UserResponse = {
  ...mockSuperAdmin, uid: 'u2', roleName: 'STORE_USER',
};

function renderWithRouter(ui: React.ReactElement, { route = '/' } = {}) {
  return render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>);
}

describe('RoleGuard', () => {
  afterEach(() => {
    useAuthStore.setState({ user: null });
  });

  it('renders children when user has allowed role', () => {
    useAuthStore.setState({ user: mockSuperAdmin });

    renderWithRouter(
      <RoleGuard allowedRoles={['SUPER_ADMIN']}>
        <div>Protected Content</div>
      </RoleGuard>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('redirects to login when no user', () => {
    useAuthStore.setState({ user: null });

    renderWithRouter(
      <RoleGuard allowedRoles={['SUPER_ADMIN']}>
        <div>Protected Content</div>
      </RoleGuard>
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('redirects to dashboard when user has wrong role', () => {
    useAuthStore.setState({ user: mockStoreUser });

    renderWithRouter(
      <RoleGuard allowedRoles={['SUPER_ADMIN']}>
        <div>Protected Content</div>
      </RoleGuard>
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('accepts multiple allowed roles', () => {
    useAuthStore.setState({ user: mockStoreUser });

    renderWithRouter(
      <RoleGuard allowedRoles={['SUPER_ADMIN', 'STORE_USER']}>
        <div>Allowed</div>
      </RoleGuard>
    );

    expect(screen.getByText('Allowed')).toBeInTheDocument();
  });
});
