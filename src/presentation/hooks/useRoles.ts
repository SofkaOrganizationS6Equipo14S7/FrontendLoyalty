import { useAuthStore } from '@/infrastructure/store';
import type { Role } from '@/domain/types';

export function useHasRole(...roles: Role[]) {
  const { user } = useAuthStore();
  return user ? roles.includes(user.roleName as Role) : false;
}

export function useIsAdmin() {
  return useHasRole('SUPER_ADMIN', 'STORE_ADMIN');
}
