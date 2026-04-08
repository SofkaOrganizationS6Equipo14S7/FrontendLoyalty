import { Pencil, Trash2, RotateCcw, ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, StatusBadge } from '@/presentation/components/ui';
import type { CustomerTierResponse, ClassificationRuleResponse } from '@/domain/types';
import { ClassificationRulesPanel } from './ClassificationRulesPanel';

const TIER_COLORS = ['border-l-amber-400', 'border-l-slate-400', 'border-l-yellow-400', 'border-l-emerald-400'];

interface TierCardProps {
  tier: CustomerTierResponse;
  isAdmin: boolean;
  isExpanded: boolean;
  classRules: ClassificationRuleResponse[];
  onEdit: (tier: CustomerTierResponse) => void;
  onDelete: (tier: CustomerTierResponse) => void;
  onActivate: (tier: CustomerTierResponse) => void;
  onToggleExpand: (tierId: string) => void;
  onCreateClassRule: (tierId: string) => void;
  onEditClassRule: (tierId: string, rule: ClassificationRuleResponse) => void;
  onDeleteClassRule: (tierId: string, ruleId: string) => void;
}

export function TierCard({
  tier, isAdmin, isExpanded, classRules,
  onEdit, onDelete, onActivate, onToggleExpand,
  onCreateClassRule, onEditClassRule, onDeleteClassRule,
}: TierCardProps) {
  return (
    <div>
      <div
        className={cn(
          'flex items-center justify-between p-4 rounded-lg border-l-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors',
          TIER_COLORS[tier.hierarchyLevel % TIER_COLORS.length],
        )}
        onClick={() => onToggleExpand(tier.id)}
      >
        <div className="flex items-center gap-3">
          {isExpanded ? <ChevronDown className="h-4 w-4 text-slate-400" /> : <ChevronRight className="h-4 w-4 text-slate-400" />}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-slate-100">{tier.name}</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">Level {tier.hierarchyLevel} &bull; {tier.discountPercentage}% discount</p>
          </div>
        </div>
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <StatusBadge active={tier.isActive} />
          {isAdmin && (
            <>
              {!tier.isActive && (
                <Button variant="ghost" size="icon" title="Reactivate" onClick={() => onActivate(tier)}>
                  <RotateCcw className="h-4 w-4 text-emerald-500" />
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={() => onEdit(tier)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700" onClick={() => onDelete(tier)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      {isExpanded && (
        <ClassificationRulesPanel
          tierId={tier.id}
          rules={classRules}
          isAdmin={isAdmin}
          onCreateRule={onCreateClassRule}
          onEditRule={onEditClassRule}
          onDeleteRule={onDeleteClassRule}
        />
      )}
    </div>
  );
}
