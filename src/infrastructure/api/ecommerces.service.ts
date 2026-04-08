import { apiClient } from './client';
import type {
  EcommerceResponse,
  EcommerceCreateRequest,
  EcommerceStatusRequest,
  ApiKeyResponse,
  ApiKeyCreateResponse,
  PageResponse,
} from '@/domain/types';

export const ecommercesService = {
  list: (params?: { status?: string; page?: number; size?: number }) =>
    apiClient
      .get<PageResponse<EcommerceResponse>>('/ecommerces', { params })
      .then((r) => r.data),

  getById: (uid: string) =>
    apiClient.get<EcommerceResponse>(`/ecommerces/${uid}`).then((r) => r.data),

  create: (data: EcommerceCreateRequest) =>
    apiClient.post<EcommerceResponse>('/ecommerces', data).then((r) => r.data),

  updateStatus: (uid: string, data: EcommerceStatusRequest) =>
    apiClient
      .put<EcommerceResponse>(`/ecommerces/${uid}/status`, data)
      .then((r) => r.data),

  // API Keys
  listApiKeys: (ecommerceId: string) =>
    apiClient
      .get<ApiKeyResponse[]>(`/ecommerces/${ecommerceId}/api-keys`)
      .then((r) => r.data),

  createApiKey: (ecommerceId: string) =>
    apiClient
      .post<ApiKeyCreateResponse>(`/ecommerces/${ecommerceId}/api-keys`)
      .then((r) => r.data),

  deleteApiKey: (ecommerceId: string, keyId: string) =>
    apiClient.delete(`/ecommerces/${ecommerceId}/api-keys/${keyId}`),
};
