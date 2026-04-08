import { DollarSign, Tag, Users, CreditCard } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/presentation/components/ui';
import type { MetricData } from './useDashboardData';

interface MetricCardItemProps {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
}

function MetricCardItem({ title, value, description, icon: Icon }: MetricCardItemProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-slate-500 dark:text-slate-400" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}

interface MetricsGridProps {
  metrics: MetricData | null;
}

export function MetricsGrid({ metrics }: MetricsGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCardItem
        title="Total Revenue"
        value={`$${(metrics?.totalRevenue || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
        description="+20.1% from last month"
        icon={DollarSign}
      />
      <MetricCardItem
        title="Active Discounts"
        value={`+${metrics?.activeDiscounts || 0}`}
        description="+180.1% from last month"
        icon={Tag}
      />
      <MetricCardItem
        title="Total Users"
        value={(metrics?.totalUsers || 0).toLocaleString()}
        description="+19% from last month"
        icon={Users}
      />
      <MetricCardItem
        title="Active Stores"
        value={String(metrics?.activeStores || 0)}
        description="+201 since last week"
        icon={CreditCard}
      />
    </div>
  );
}
