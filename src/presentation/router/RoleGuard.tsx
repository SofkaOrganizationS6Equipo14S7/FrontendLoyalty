import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/infrastructure/store';
import type { Role } from '@/domain/types';

interface RoleGuardProps {
  allowedRoles: Role[];
  children: React.ReactNode;
}

export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const { user } = useAuthStore();

  if (!user) return <Navigate to="/login" replace />;

  if (!allowedRoles.includes(user.roleName as Role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
