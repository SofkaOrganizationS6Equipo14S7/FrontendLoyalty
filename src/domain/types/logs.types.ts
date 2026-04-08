export interface AuditLogResponse {
  id: string;
  userId: string;
  ecommerceId: string | null;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'READ';
  entityName: string;
  entityId: string;
  oldValue: Record<string, unknown> | null;
  newValue: Record<string, unknown> | null;
  createdAt: string;
}

export interface DiscountApplicationLogResponse {
  id: string;
  ecommerceId: string;
  externalOrderId: string;
  originalAmount: number;
  discountApplied: number;
  finalAmount: number;
  appliedRulesDetails: AppliedRuleDetail[];
  createdAt: string;
}

export interface AppliedRuleDetail {
  ruleId: string;
  ruleName: string;
  discountType: string;
  discountValue: number;
  appliedPercentage: number;
}
