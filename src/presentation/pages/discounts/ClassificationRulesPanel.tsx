import { Plus, Pencil, Trash2 } from 'lucide-react';
import {
  Button,
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from '@/presentation/components/ui';
import type { ClassificationRuleResponse } from '@/domain/types';

interface ClassificationRulesPanelProps {
  tierId: string;
  rules: ClassificationRuleResponse[];
  isAdmin: boolean;
  onCreateRule: (tierId: string) => void;
  onEditRule: (tierId: string, rule: ClassificationRuleResponse) => void;
  onDeleteRule: (tierId: string, ruleId: string) => void;
}

export function ClassificationRulesPanel({
  tierId, rules, isAdmin,
  onCreateRule, onEditRule, onDeleteRule,
}: ClassificationRulesPanelProps) {
  return (
    <div className="ml-8 mt-2 mb-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-4">
      <div className="flex items-center justify-between mb-3">
        <h5 className="text-sm font-medium text-slate-700 dark:text-slate-300">Classification Rules</h5>
        {isAdmin && (
          <Button size="sm" variant="outline" className="gap-1 h-7 text-xs" onClick={() => onCreateRule(tierId)}>
            <Plus className="h-3 w-3" /> Add
          </Button>
        )}
      </div>
      {rules.length === 0 ? (
        <p className="text-sm text-slate-400">No classification rules. These define how customers are assigned to this tier.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Metric</TableHead>
              <TableHead>Min</TableHead>
              <TableHead>Max</TableHead>
              <TableHead>Priority</TableHead>
              {isAdmin && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rules.map((cr) => (
              <TableRow key={cr.id}>
                <TableCell className="font-medium">{cr.metricType}</TableCell>
                <TableCell>{cr.minValue}</TableCell>
                <TableCell>{cr.maxValue}</TableCell>
                <TableCell>{cr.priority}</TableCell>
                {isAdmin && (
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEditRule(tierId, cr)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={() => onDeleteRule(tierId, cr.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
