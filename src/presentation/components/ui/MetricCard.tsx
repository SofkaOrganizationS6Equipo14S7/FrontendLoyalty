import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from './Card';

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  className?: string;
}

export function MetricCard({ label, value, icon: Icon, trend, className }: MetricCardProps) {
  return (
    <Card className={cn('flex items-start justify-between p-6', className)}>
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {label}
        </p>
        <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">
          {value}
        </p>
        {trend && (
          <div className="mt-2 flex items-center gap-1">
            {trend.value >= 0 ? (
              <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5 text-rose-500" />
            )}
            <span
              className={cn(
                'text-xs font-medium',
                trend.value >= 0 ? 'text-emerald-600' : 'text-rose-600',
              )}
            >
              {trend.value > 0 ? '+' : ''}
              {trend.value}%
            </span>
            <span className="text-xs text-slate-400">{trend.label}</span>
          </div>
        )}
      </div>
      <div className="rounded-lg bg-indigo-50 dark:bg-indigo-900/20 p-2.5">
        <Icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
      </div>
    </Card>
  );
}
