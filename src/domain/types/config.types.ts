export interface DiscountConfigResponse {
  id: string;
  ecommerceId: string;
  maxDiscountCap: number;
  currencyCode: string;
  allowStacking: boolean;
  roundingRule: string;
  isActive: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface DiscountConfigCreateRequest {
  ecommerceId: string;
  currency: string;
  roundingRule: string;
  cap: {
    type: 'PERCENTAGE' | 'FIXED';
    value: number;
    appliesTo?: 'SUBTOTAL' | 'TOTAL';
  };
  priority: {
    type: string;
    order: number;
  }[];
}

export interface DiscountLimitPriorityResponse {
  id: string;
  discountConfigId: string;
  priorities: {
    discountType: string;
    priorityLevel: number;
  }[];
}

export interface ConfigurationPatchRequest {
  currency?: string;
  roundingRule?: string;
  cap?: {
    type: 'PERCENTAGE' | 'FIXED';
    value: number;
    appliesTo?: 'SUBTOTAL' | 'TOTAL';
  };
  priority?: {
    type: string;
    order: number;
  }[];
}
