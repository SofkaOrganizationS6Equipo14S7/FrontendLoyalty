import { render, screen } from '@testing-library/react';

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  LineChart: ({ children }: any) => <div>{children}</div>,
  Line: () => <div />,
  XAxis: () => <div />,
  YAxis: () => <div />,
  CartesianGrid: () => <div />,
  Tooltip: () => <div />,
}));

const mockUseDashboardData = vi.hoisted(() => vi.fn());
vi.mock('@/presentation/pages/dashboard/useDashboardData', () => ({
  useDashboardData: mockUseDashboardData,
}));

import { DashboardPage } from '@/presentation/pages/dashboard';

describe('DashboardPage', () => {
  it('renders loading skeletons when loading', () => {
    mockUseDashboardData.mockReturnValue({
      metrics: null,
      chartData: [],
      activity: [],
      loading: true,
    });
    const { container } = render(<DashboardPage />);
    expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0);
  });

  it('renders metrics grid when loaded', () => {
    mockUseDashboardData.mockReturnValue({
      metrics: {
        totalRevenue: 1000,
        activeDiscounts: 5,
        totalUsers: 100,
        activeStores: 3,
      },
      chartData: [],
      activity: [],
      loading: false,
    });
    render(<DashboardPage />);
    expect(screen.getByText('Total Revenue')).toBeInTheDocument();
    expect(screen.getByText('Active Discounts')).toBeInTheDocument();
  });

  it('renders recent activity section', () => {
    mockUseDashboardData.mockReturnValue({
      metrics: null,
      chartData: [],
      activity: [],
      loading: false,
    });
    render(<DashboardPage />);
    expect(screen.getByText('Recent Activity')).toBeInTheDocument();
  });
});
