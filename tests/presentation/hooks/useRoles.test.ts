import { renderHook } from '@testing-library/react';
import { useHasRole, useIsAdmin } from '@/presentation/hooks/useRoles';
import { useAuthStore } from '@/infrastructure/store/auth.store';
import type { UserResponse } from '@/domain/types';

const mockSuperAdmin: UserResponse = {
  uid: 'u1', username: 'superadmin', roleId: 'r1', roleName: 'SUPER_ADMIN',
  email: 'sa@test.com', ecommerceId: null, isActive: true,
  createdAt: '2024-01-01', updatedAt: '2024-01-01',
};

const mockStoreAdmin: UserResponse = {
  ...mockSuperAdmin, uid: 'u2', username: 'storeadmin', roleName: 'STORE_ADMIN',
};

const mockStoreUser: UserResponse = {
  ...mockSuperAdmin, uid: 'u3', username: 'storeuser', roleName: 'STORE_USER',
};

describe('useHasRole', () => {
  afterEach(() => {
    useAuthStore.setState({ user: null });
  });

  it('returns true when user has the specified role', () => {
    useAuthStore.setState({ user: mockSuperAdmin });
    const { result } = renderHook(() => useHasRole('SUPER_ADMIN'));
    expect(result.current).toBe(true);
  });

  it('returns false when user has a different role', () => {
    useAuthStore.setState({ user: mockStoreUser });
    const { result } = renderHook(() => useHasRole('SUPER_ADMIN'));
    expect(result.current).toBe(false);
  });

  it('returns false when no user', () => {
    useAuthStore.setState({ user: null });
    const { result } = renderHook(() => useHasRole('SUPER_ADMIN'));
    expect(result.current).toBe(false);
  });

  it('accepts multiple roles', () => {
    useAuthStore.setState({ user: mockStoreAdmin });
    const { result } = renderHook(() => useHasRole('SUPER_ADMIN', 'STORE_ADMIN'));
    expect(result.current).toBe(true);
  });
});

describe('useIsAdmin', () => {
  afterEach(() => {
    useAuthStore.setState({ user: null });
  });

  it('returns true for SUPER_ADMIN', () => {
    useAuthStore.setState({ user: mockSuperAdmin });
    const { result } = renderHook(() => useIsAdmin());
    expect(result.current).toBe(true);
  });

  it('returns true for STORE_ADMIN', () => {
    useAuthStore.setState({ user: mockStoreAdmin });
    const { result } = renderHook(() => useIsAdmin());
    expect(result.current).toBe(true);
  });

  it('returns false for STORE_USER', () => {
    useAuthStore.setState({ user: mockStoreUser });
    const { result } = renderHook(() => useIsAdmin());
    expect(result.current).toBe(false);
  });

  it('returns false when no user', () => {
    useAuthStore.setState({ user: null });
    const { result } = renderHook(() => useIsAdmin());
    expect(result.current).toBe(false);
  });
});
