import { ArrowUp, ArrowDown, Trash2, Link2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge, Button, Switch } from '@/presentation/components/ui';
import type { RuleResponse } from '@/domain/types';

interface RuleCardProps {
  rule: RuleResponse;
  index: number;
  totalRules: number;
  isAdmin: boolean;
  onEdit: (rule: RuleResponse) => void;
  onDelete: (rule: RuleResponse) => void;
  onToggleActive: (rule: RuleResponse) => void;
  onAssignTiers: (rule: RuleResponse) => void;
}

export function RuleCard({
  rule, index, totalRules, isAdmin,
  onEdit, onDelete, onToggleActive, onAssignTiers,
}: RuleCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-lg border bg-white dark:bg-slate-950 transition-colors',
        rule.isActive
          ? 'border-slate-200 dark:border-slate-800 shadow-sm'
          : 'border-slate-100 dark:border-slate-800/50 opacity-70',
      )}
    >
      <div className="flex items-center gap-4 flex-1">
        <RulePriorityControl index={index} totalRules={totalRules} />
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-slate-900 dark:text-slate-100">{rule.name}</h4>
            {!rule.isActive && <Badge variant="secondary" className="text-[10px] py-0">Inactive</Badge>}
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 px-2 py-0.5 rounded-md font-medium">
              {rule.discountPercentage}%
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 mr-1">
          <span className="font-medium">{rule.isActive ? 'On' : 'Off'}</span>
          <Switch checked={rule.isActive} onCheckedChange={() => onToggleActive(rule)} />
        </div>
        {isAdmin && (
          <>
            <Button variant="ghost" size="icon" title="Assign Tiers" onClick={() => onAssignTiers(rule)}>
              <Link2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => onEdit(rule)}>Edit</Button>
            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700" onClick={() => onDelete(rule)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

function RulePriorityControl({ index, totalRules }: { index: number; totalRules: number }) {
  return (
    <div className="flex flex-col items-center justify-center space-y-1">
      <button disabled={index === 0} className="text-slate-400 hover:text-indigo-600 disabled:opacity-30 transition-colors">
        <ArrowUp className="h-4 w-4" />
      </button>
      <span className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
        P{index + 1}
      </span>
      <button disabled={index === totalRules - 1} className="text-slate-400 hover:text-indigo-600 disabled:opacity-30 transition-colors">
        <ArrowDown className="h-4 w-4" />
      </button>
    </div>
  );
}
