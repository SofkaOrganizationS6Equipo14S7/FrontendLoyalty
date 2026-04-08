export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  tipo: string;
  username: string;
  role: string;
}

export interface UserResponse {
  uid: string;
  username: string;
  roleId: string;
  roleName: string;
  email: string;
  ecommerceId: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserCreateRequest {
  username: string;
  email: string;
  password: string;
  roleId: string;
  ecommerceId?: string | null;
}

export interface UserUpdateRequest {
  username?: string;
  email?: string;
  roleId?: string;
  ecommerceId?: string | null;
}

export interface ProfileUpdateRequest {
  name: string;
  email: string;
}

export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export type Role = 'SUPER_ADMIN' | 'STORE_ADMIN' | 'STORE_USER';

export interface RoleResponse {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PermissionResponse {
  id: string;
  code: string;
  description: string;
  module: string;
  createdAt: string;
  updatedAt: string;
}

export interface RoleWithPermissionsResponse extends RoleResponse {
  permissions: PermissionResponse[];
}
