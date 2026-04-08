import { Save, GripVertical } from 'lucide-react';
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent,
  Input, Select, Button,
} from '@/presentation/components/ui';

interface PriorityItem {
  type: string;
  displayName: string;
  order: number;
}

interface DiscountConfigSectionProps {
  capType: 'PERCENTAGE' | 'FIXED';
  maxCap: string;
  currency: string;
  roundingRule: string;
  priorities: PriorityItem[];
  saving: boolean;
  onCapTypeChange: (value: 'PERCENTAGE' | 'FIXED') => void;
  onMaxCapChange: (value: string) => void;
  onCurrencyChange: (value: string) => void;
  onRoundingRuleChange: (value: string) => void;
  onMovePriority: (index: number, direction: 'up' | 'down') => void;
  onSave: () => void;
}

export function DiscountConfigSection({
  capType, maxCap, currency, roundingRule, priorities, saving,
  onCapTypeChange, onMaxCapChange, onCurrencyChange, onRoundingRuleChange,
  onMovePriority, onSave,
}: DiscountConfigSectionProps) {
  return (
    <>
      <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mt-4">Discount Configuration</h2>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Discount Cap</CardTitle>
            <CardDescription>Maximum discount that can be applied</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select
              label="Cap Type"
              value={capType}
              onChange={(e) => onCapTypeChange(e.target.value as 'PERCENTAGE' | 'FIXED')}
              options={[
                { value: 'PERCENTAGE', label: 'Percentage (%)' },
                { value: 'FIXED', label: 'Fixed Amount' },
              ]}
            />
            <Input
              label={capType === 'PERCENTAGE' ? 'Max Percentage' : 'Max Amount'}
              type="number"
              min="0"
              step="0.01"
              value={maxCap}
              onChange={(e) => onMaxCapChange(e.target.value)}
              placeholder={capType === 'PERCENTAGE' ? '25.00' : '50000'}
            />
            <Input
              label="Currency"
              value={currency}
              onChange={(e) => onCurrencyChange(e.target.value.toUpperCase())}
              maxLength={3}
              placeholder="CLP"
            />
            <Select
              label="Rounding Rule"
              value={roundingRule}
              onChange={(e) => onRoundingRuleChange(e.target.value)}
              options={[
                { value: 'ROUND_HALF_UP', label: 'Standard rounding' },
                { value: 'ROUND_UP', label: 'Always round up' },
                { value: 'ROUND_DOWN', label: 'Always round down' },
              ]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Discount Priority</CardTitle>
            <CardDescription>Order in which discount types are evaluated</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {priorities.map((priority, index) => (
                <div
                  key={priority.type}
                  className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800"
                >
                  <GripVertical className="h-4 w-4 text-slate-400" />
                  <span className="flex-1 text-sm font-medium text-slate-700 dark:text-slate-300">{priority.displayName}</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => onMovePriority(index, 'up')}
                      disabled={index === 0}
                      className="px-2 py-1 text-xs rounded bg-slate-200 dark:bg-slate-800 disabled:opacity-30 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => onMovePriority(index, 'down')}
                      disabled={index === priorities.length - 1}
                      className="px-2 py-1 text-xs rounded bg-slate-200 dark:bg-slate-800 disabled:opacity-30 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                    >
                      ↓
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button onClick={onSave} isLoading={saving} className="gap-2">
                <Save className="h-4 w-4" /> Save Configuration
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
