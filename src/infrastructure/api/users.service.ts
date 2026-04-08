import { apiClient } from './client';
import type {
  UserResponse,
  UserCreateRequest,
  UserUpdateRequest,
  PageResponse,
} from '@/domain/types';

export const usersService = {
  list: (params?: { ecommerceId?: string; page?: number; size?: number }) =>
    apiClient
      .get<PageResponse<UserResponse>>('/users', { params })
      .then((r) => r.data),

  getById: (uid: string) =>
    apiClient.get<UserResponse>(`/users/${uid}`).then((r) => r.data),

  create: (data: UserCreateRequest) =>
    apiClient.post<UserResponse>('/users', data).then((r) => r.data),

  update: (uid: string, data: UserUpdateRequest) =>
    apiClient.put<UserResponse>(`/users/${uid}`, data).then((r) => r.data),

  delete: (uid: string) => apiClient.delete(`/users/${uid}`),
};
