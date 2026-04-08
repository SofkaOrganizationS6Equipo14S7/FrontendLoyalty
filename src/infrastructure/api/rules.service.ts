import { apiClient } from './client';
import type {
  RuleResponse,
  RuleCreateRequest,
  DiscountTypeDTO,
  RuleAttributeMetadataDTO,
  DiscountPriorityDTO,
  CustomerTierResponse,
  CustomerTierCreateRequest,
  CustomerTierUpdateRequest,
  RuleCustomerTierDTO,
  ClassificationRuleResponse,
  ClassificationRuleCreateRequest,
  ClassificationRuleUpdateRequest,
  PageResponse,
} from '@/domain/types';

export const rulesService = {
  // Discount types
  getDiscountTypes: () =>
    apiClient.get<DiscountTypeDTO[]>('/rules/discount-types').then((r) => r.data),

  getAttributes: (discountTypeId: string) =>
    apiClient
      .get<RuleAttributeMetadataDTO[]>('/rules/attributes', {
        params: { discountTypeId },
      })
      .then((r) => r.data),

  getDiscountPriorities: (discountTypeId: string) =>
    apiClient
      .get<DiscountPriorityDTO[]>('/rules/discount-priorities', {
        params: { discountTypeId },
      })
      .then((r) => r.data),

  // Rules CRUD
  list: (params?: { page?: number; size?: number; active?: boolean }) =>
    apiClient
      .get<PageResponse<RuleResponse>>('/rules', { params })
      .then((r) => r.data),

  getById: (ruleId: string) =>
    apiClient.get<RuleResponse>(`/rules/${ruleId}`).then((r) => r.data),

  create: (data: RuleCreateRequest) =>
    apiClient.post<RuleResponse>('/rules', data).then((r) => r.data),

  update: (ruleId: string, data: RuleCreateRequest) =>
    apiClient.put<RuleResponse>(`/rules/${ruleId}`, data).then((r) => r.data),

  delete: (ruleId: string) => apiClient.delete(`/rules/${ruleId}`),

  // Rule-tier associations
  addTiers: (ruleId: string, customerTierIds: string[]) =>
    apiClient
      .post<RuleResponse>(`/rules/${ruleId}/tiers`, { customerTierIds })
      .then((r) => r.data),

  getRuleTiers: (ruleId: string) =>
    apiClient
      .get<RuleCustomerTierDTO[]>(`/rules/${ruleId}/tiers`)
      .then((r) => r.data),

  removeTier: (ruleId: string, tierId: string) =>
    apiClient.delete(`/rules/${ruleId}/tiers/${tierId}`),

  // Classification rules for customer tiers
  getClassificationRules: (tierId: string) =>
    apiClient
      .get<ClassificationRuleResponse[]>(`/rules/customer-tiers/${tierId}`)
      .then((r) => r.data),

  createClassificationRule: (tierId: string, data: ClassificationRuleCreateRequest) =>
    apiClient
      .post<ClassificationRuleResponse>(`/rules/customer-tiers/${tierId}`, data)
      .then((r) => r.data),

  updateClassificationRule: (tierId: string, ruleId: string, data: ClassificationRuleUpdateRequest) =>
    apiClient
      .put<ClassificationRuleResponse>(`/rules/customer-tiers/${tierId}/${ruleId}`, data)
      .then((r) => r.data),

  deleteClassificationRule: (tierId: string, ruleId: string) =>
    apiClient.delete(`/rules/customer-tiers/${tierId}/${ruleId}`),
};

export const tiersService = {
  list: (params?: { isActive?: boolean; page?: number; size?: number }) =>
    apiClient
      .get<PageResponse<CustomerTierResponse>>('/customer-tiers', { params })
      .then((r) => r.data),

  getById: (tierId: string) =>
    apiClient
      .get<CustomerTierResponse>(`/customer-tiers/${tierId}`)
      .then((r) => r.data),

  create: (data: CustomerTierCreateRequest) =>
    apiClient
      .post<CustomerTierResponse>('/customer-tiers', data)
      .then((r) => r.data),

  update: (tierId: string, data: CustomerTierUpdateRequest) =>
    apiClient
      .put<CustomerTierResponse>(`/customer-tiers/${tierId}`, data)
      .then((r) => r.data),

  delete: (tierId: string) => apiClient.delete(`/customer-tiers/${tierId}`),

  activate: (tierId: string) =>
    apiClient
      .put<CustomerTierResponse>(`/customer-tiers/${tierId}/activate`)
      .then((r) => r.data),
};
