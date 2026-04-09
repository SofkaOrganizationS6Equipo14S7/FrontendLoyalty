import { useEffect, useState } from 'react';
import { discountLogsService, rulesService, ecommercesService, usersService } from '@/infrastructure/api';
import { getTimeAgo } from '@/lib/utils';

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export interface MetricData {
  totalRevenue: number;
  activeDiscounts: number;
  totalUsers: number;
  activeStores: number;
}

export interface ChartDataPoint {
  name: string;
  revenue: number;
  discounts: number;
}

export interface ActivityItem {
  store: string;
  action: string;
  time: string;
}

export function useDashboardData() {
  const [metrics, setMetrics] = useState<MetricData | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [logs, rules, ecommerces, users] = await Promise.all([
          discountLogsService.list().catch(() => ({ content: [] })),
          rulesService.list().catch(() => ({ content: [] })),
          ecommercesService.list().catch(() => ({ content: [] })),
          usersService.list().catch(() => ({ content: [] })),
        ]);

        const allLogs = logs.content || [];
        const allRules = rules.content || [];
        const allEcommerces = ecommerces.content || [];
        const allUsers = users.content || [];

        const totalRevenue = allLogs.reduce((sum: number, l: any) => sum + (l.orderAmount || 0), 0);
        const activeDiscounts = allRules.filter((r: any) => r.isActive).length;

        setMetrics({
          totalRevenue,
          activeDiscounts,
          totalUsers: allUsers.length,
          activeStores: allEcommerces.filter((e: any) => e.status === 'ACTIVE').length,
        });

        const monthMap = new Map<number, { revenue: number; discounts: number }>();
        allLogs.forEach((l: any) => {
          const d = new Date(l.createdAt || l.appliedAt || Date.now());
          const month = d.getMonth();
          const existing = monthMap.get(month) || { revenue: 0, discounts: 0 };
          existing.revenue += l.orderAmount || 0;
          existing.discounts += l.discountApplied || 0;
          monthMap.set(month, existing);
        });

        setChartData(
          monthNames.map((name, idx) => ({
            name,
            revenue: monthMap.get(idx)?.revenue || 0,
            discounts: monthMap.get(idx)?.discounts || 0,
          })),
        );

        setActivity(
          allLogs.slice(0, 5).map((l: any) => {
            const ecom = allEcommerces.find((e: any) => e.id === l.ecommerceId);
            return {
              store: ecom?.name || 'Unknown Store',
              action: `applied ${l.ruleName || 'discount'} ($${(l.discountApplied || 0).toFixed(2)})`,
              time: getTimeAgo(l.createdAt || l.appliedAt),
            };
          }),
        );
      } catch {
        /* handled */
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return { metrics, chartData, activity, loading };
}
