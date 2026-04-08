import { apiClient } from './client';
import type { RoleResponse, RoleWithPermissionsResponse, PermissionResponse } from '@/domain/types';

export const rolesService = {
  list: () =>
    apiClient.get<RoleResponse[]>('/roles').then((r) => r.data),

  getById: (roleId: string) =>
    apiClient.get<RoleWithPermissionsResponse>(`/roles/${roleId}`).then((r) => r.data),

  getPermissions: (module?: string) =>
    apiClient.get<PermissionResponse[]>('/permissions', { params: module ? { module } : {} }).then((r) => r.data),

  assignPermissions: (roleId: string, permissionIds: string[]) =>
    apiClient.post<RoleWithPermissionsResponse>(`/roles/${roleId}/permissions`, { permissionIds }).then((r) => r.data),
};
