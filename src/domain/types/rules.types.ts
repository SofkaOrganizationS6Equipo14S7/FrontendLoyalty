export interface DiscountTypeDTO {
  id: string;
  code: string;
  displayName: string;
  createdAt: string;
}

export interface RuleAttributeMetadataDTO {
  id: string;
  discountTypeId: string;
  attributeName: string;
  attributeType: 'VARCHAR' | 'NUMERIC' | 'DATE' | 'BOOLEAN';
  isRequired: boolean;
  defaultValue: string | null;
  description: string | null;
  createdAt: string;
}

export interface DiscountPriorityDTO {
  id: string;
  discountSettingId: string;
  discountTypeId: string;
  priorityLevel: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RuleAttributeValue {
  attributeId: string;
  attributeName: string;
  attributeType: string;
  value: string;
}

export interface RuleResponse {
  id: string;
  ecommerceId: string;
  discountPriorityId: string;
  name: string;
  description: string;
  discountPercentage: number;
  isActive: boolean;
  attributes: RuleAttributeValue[];
  createdAt: string;
  updatedAt: string;
}

export interface RuleCreateRequest {
  name: string;
  description?: string;
  discountPercentage: number;
  discountPriorityId: string;
  attributes: Record<string, string>;
}

export interface CustomerTierResponse {
  id: string;
  ecommerceId: string;
  name: string;
  discountPercentage: number;
  hierarchyLevel: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerTierCreateRequest {
  ecommerceId: string;
  name: string;
  discountPercentage: number;
  hierarchyLevel: number;
}

export interface CustomerTierUpdateRequest {
  name: string;
  discountPercentage: number;
  hierarchyLevel: number;
}

export interface RuleCustomerTierDTO {
  id: string;
  ruleId: string;
  customerTierId: string;
  customerTierName: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClassificationRuleResponse {
  id: string;
  customerTierId: string;
  metricType: string;
  minValue: number;
  maxValue: number;
  priority: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ClassificationRuleCreateRequest {
  metricType: string;
  minValue: number;
  maxValue: number;
  priority: number;
}

export interface ClassificationRuleUpdateRequest {
  metricType?: string;
  minValue?: number;
  maxValue?: number;
  priority?: number;
}
