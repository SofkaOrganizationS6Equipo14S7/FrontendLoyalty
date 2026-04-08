import { apiClient } from './client';
import type { LoginRequest, LoginResponse, UserResponse, PasswordChangeRequest, ProfileUpdateRequest } from '@/domain/types';

export const authService = {
  login: (data: LoginRequest) =>
    apiClient.post<LoginResponse>('/auth/login', data).then((r) => r.data),

  logout: () => apiClient.post('/auth/logout'),

  me: () => apiClient.get<UserResponse>('/auth/me').then((r) => r.data),

  updateProfile: (data: ProfileUpdateRequest) =>
    apiClient.put<UserResponse>('/users/me', data).then((r) => r.data),

  changePassword: (data: PasswordChangeRequest) =>
    apiClient.put<LoginResponse>('/users/me/password', data).then((r) => r.data),
};
