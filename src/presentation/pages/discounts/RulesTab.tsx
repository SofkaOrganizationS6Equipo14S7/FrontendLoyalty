import { Info, Plus } from 'lucide-react';
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent,
  Badge, Button, EmptyState,
} from '@/presentation/components/ui';
import type { RuleResponse } from '@/domain/types';
import { RuleCard } from './RuleCard';

interface RulesTabProps {
  rules: RuleResponse[];
  tabLabel: string;
  isAdmin: boolean;
  onCreateRule: () => void;
  onEditRule: (rule: RuleResponse) => void;
  onDeleteRule: (rule: RuleResponse) => void;
  onToggleActive: (rule: RuleResponse) => void;
  onAssignTiers: (rule: RuleResponse) => void;
}

export function RulesTab({
  rules, tabLabel, isAdmin,
  onCreateRule, onEditRule, onDeleteRule, onToggleActive, onAssignTiers,
}: RulesTabProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {tabLabel} Rules
              <Badge variant="secondary" className="ml-2 font-normal text-xs">{rules.length} Total</Badge>
            </CardTitle>
            <CardDescription>Rules are applied in order of priority. Lower numbers execute first.</CardDescription>
          </div>
          {isAdmin && (
            <Button size="sm" className="gap-1.5" onClick={onCreateRule}>
              <Plus className="h-4 w-4" /> Add Rule
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {rules.length === 0 ? (
            <EmptyState
              icon={<Info className="h-6 w-6" />}
              title="No rules configured"
              description={`Create your first ${tabLabel.toLowerCase()} discount rule.`}
              action={isAdmin ? <Button variant="outline" onClick={onCreateRule}>Create Rule</Button> : undefined}
            />
          ) : (
            rules.map((rule, index) => (
              <RuleCard
                key={rule.id}
                rule={rule}
                index={index}
                totalRules={rules.length}
                isAdmin={isAdmin}
                onEdit={onEditRule}
                onDelete={onDeleteRule}
                onToggleActive={onToggleActive}
                onAssignTiers={onAssignTiers}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
