import { Info, Plus, Pencil, Trash2, RotateCcw, ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent,
  Badge, Button, StatusBadge, EmptyState,
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from '@/presentation/components/ui';
import type { CustomerTierResponse, ClassificationRuleResponse } from '@/domain/types';

const TIER_COLORS = ['border-l-amber-400', 'border-l-slate-400', 'border-l-yellow-400', 'border-l-emerald-400'];

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
              <div key={tier.id}>
                <div
                  className={cn(
                    'flex items-center justify-between p-4 rounded-lg border-l-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors',
                    TIER_COLORS[tier.hierarchyLevel % TIER_COLORS.length],
                  )}
                  onClick={() => onToggleExpand(tier.id)}
                >
                  <div className="flex items-center gap-3">
                    {expandedTier === tier.id ? <ChevronDown className="h-4 w-4 text-slate-400" /> : <ChevronRight className="h-4 w-4 text-slate-400" />}
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
                          <Button variant="ghost" size="icon" title="Reactivate" onClick={() => onActivateTier(tier)}>
                            <RotateCcw className="h-4 w-4 text-emerald-500" />
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" onClick={() => onEditTier(tier)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700" onClick={() => onDeleteTier(tier)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {expandedTier === tier.id && (
                  <div className="ml-8 mt-2 mb-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="text-sm font-medium text-slate-700 dark:text-slate-300">Classification Rules</h5>
                      {isAdmin && (
                        <Button size="sm" variant="outline" className="gap-1 h-7 text-xs" onClick={() => onCreateClassRule(tier.id)}>
                          <Plus className="h-3 w-3" /> Add
                        </Button>
                      )}
                    </div>
                    {(classRules[tier.id] || []).length === 0 ? (
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
                          {classRules[tier.id].map((cr) => (
                            <TableRow key={cr.id}>
                              <TableCell className="font-medium">{cr.metricType}</TableCell>
                              <TableCell>{cr.minValue}</TableCell>
                              <TableCell>{cr.maxValue}</TableCell>
                              <TableCell>{cr.priority}</TableCell>
                              {isAdmin && (
                                <TableCell className="text-right">
                                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEditClassRule(tier.id, cr)}>
                                    <Pencil className="h-3.5 w-3.5" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={() => onDeleteClassRule(tier.id, cr.id)}>
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
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
