import { CardSkeleton } from '@/presentation/components/ui';
import { useDashboardData } from './useDashboardData';
import { MetricsGrid } from './MetricsGrid';
import { RevenueChart } from './RevenueChart';
import { RecentActivity } from './RecentActivity';

export function DashboardPage() {
  const { metrics, chartData, activity, loading } = useDashboardData();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <MetricsGrid metrics={metrics} />
      <div className="grid gap-4 lg:grid-cols-7">
        <RevenueChart data={chartData} />
        <RecentActivity activity={activity} />
      </div>
    </div>
  );
}
