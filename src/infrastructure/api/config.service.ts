import { apiClient } from './client';
import type { DiscountConfigResponse, DiscountConfigCreateRequest, ConfigurationPatchRequest, ApiResponse } from '@/domain/types';

export const configService = {
  get: (ecommerceId: string) =>
    apiClient
      .get<DiscountConfigResponse>('/discount-config', { params: { ecommerceId } })
      .then((r) => r.data),

  create: (data: DiscountConfigCreateRequest) =>
    apiClient
      .post<DiscountConfigResponse>('/discount-config', data)
      .then((r) => r.data),

  // Configuration endpoints
  createConfiguration: (data: DiscountConfigCreateRequest) =>
    apiClient
      .post<ApiResponse<unknown>>('/configurations', data)
      .then((r) => r.data),

  patchConfiguration: (ecommerceId: string, data: ConfigurationPatchRequest) =>
    apiClient
      .patch<ApiResponse<unknown>>(`/configurations/${ecommerceId}`, data)
      .then((r) => r.data),

  // Priorities
  setPriorities: (data: { discountConfigId: string; priorities: { discountType: string; priorityLevel: number }[] }) =>
    apiClient
      .post('/discount-priority', data)
      .then((r) => r.data),

  getPriorities: (discountSettingId: string) =>
    apiClient
      .get('/discount-priority', { params: { discountSettingId } })
      .then((r) => r.data),
};
