import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/presentation/components/ui';
import type { ActivityItem } from './useDashboardData';

interface RecentActivityProps {
  activity: ActivityItem[];
}

export function RecentActivity({ activity }: RecentActivityProps) {
  return (
    <Card className="lg:col-span-3">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest operations across all stores.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {activity.length > 0 ? (
            activity.map((item, idx) => (
              <div key={idx} className="flex items-center">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none text-slate-900 dark:text-slate-100">
                    {item.store}{' '}
                    <span className="font-normal text-slate-500 dark:text-slate-400">
                      {item.action}
                    </span>
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{item.time}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">No recent activity</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
