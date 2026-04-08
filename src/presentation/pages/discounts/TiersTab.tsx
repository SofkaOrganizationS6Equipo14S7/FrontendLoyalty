import { Info, Plus } from 'lucide-react';
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent,
  Badge, Button, EmptyState,
} from '@/presentation/components/ui';
import type { CustomerTierResponse, ClassificationRuleResponse } from '@/domain/types';
import { TierCard } from './TierCard';

interface TiersTabProps {
  tiers: CustomerTierResponse[];
  isAdmin: boolean;
  expandedTier: string | null;
  classRules: Record<string, ClassificationRuleResponse[]>;
  onCreateTier: () => void;
  onEditTier: (tier: CustomerTierResponse) => void;
  onDeleteTier: (tier: CustomerTierResponse) => void;
  onActivateTier: (tier: CustomerTierResponse) => void;
  onToggleExpand: (tierId: string) => void;
  onCreateClassRule: (tierId: string) => void;
  onEditClassRule: (tierId: string, rule: ClassificationRuleResponse) => void;
  onDeleteClassRule: (tierId: string, ruleId: string) => void;
}

export function TiersTab({
  tiers, isAdmin, expandedTier, classRules,
  onCreateTier, onEditTier, onDeleteTier, onActivateTier,
  onToggleExpand, onCreateClassRule, onEditClassRule, onDeleteClassRule,
}: TiersTabProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Loyalty Tiers
              <Badge variant="secondary" className="ml-2 font-normal text-xs">{tiers.length} Total</Badge>
            </CardTitle>
            <CardDescription>Customer tiers with automatic discount percentages. Expand to manage classification rules.</CardDescription>
          </div>
          {isAdmin && (
            <Button size="sm" className="gap-1.5" onClick={onCreateTier}>
              <Plus className="h-4 w-4" /> Add Tier
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {tiers.length === 0 ? (
          <EmptyState
            icon={<Info className="h-6 w-6" />}
            title="No tiers configured"
            description="Create loyalty tiers to offer tiered discounts."
            action={isAdmin ? <Button variant="outline" onClick={onCreateTier}>Create Tier</Button> : undefined}
          />
        ) : (
          <div className="space-y-3">
            {tiers.sort((a, b) => a.hierarchyLevel - b.hierarchyLevel).map((tier) => (
              <TierCard
                key={tier.id}
                tier={tier}
                isAdmin={isAdmin}
                isExpanded={expandedTier === tier.id}
                classRules={classRules[tier.id] || []}
                onEdit={onEditTier}
                onDelete={onDeleteTier}
                onActivate={onActivateTier}
                onToggleExpand={onToggleExpand}
                onCreateClassRule={onCreateClassRule}
                onEditClassRule={onEditClassRule}
                onDeleteClassRule={onDeleteClassRule}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
