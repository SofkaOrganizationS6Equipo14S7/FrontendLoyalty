import { apiClient } from './client';
import type {
  AuditLogResponse,
  DiscountApplicationLogResponse,
  PageResponse,
} from '@/domain/types';

export const auditService = {
  list: (params?: {
    entityName?: string;
    ecommerceId?: string;
    page?: number;
    size?: number;
  }) =>
    apiClient
      .get<PageResponse<AuditLogResponse>>('/audit-logs', { params })
      .then((r) => r.data),

  getById: (logId: string) =>
    apiClient.get<AuditLogResponse>(`/audit-logs/${logId}`).then((r) => r.data),
};

export const discountLogsService = {
  list: (params?: {
    ecommerceId?: string;
    externalOrderId?: string;
    page?: number;
    size?: number;
  }) =>
    apiClient
      .get<PageResponse<DiscountApplicationLogResponse>>('/discount-logs', {
        params,
      })
      .then((r) => r.data),

  getById: (logId: string) =>
    apiClient
      .get<DiscountApplicationLogResponse>(`/discount-logs/${logId}`)
      .then((r) => r.data),
};
