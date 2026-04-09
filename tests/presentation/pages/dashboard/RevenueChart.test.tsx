import { render, screen } from '@testing-library/react';
import { RevenueChart } from '@/presentation/pages/dashboard/RevenueChart';

// Mock recharts to avoid canvas/SVG rendering issues in jsdom
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div data-testid="chart-container">{children}</div>,
  LineChart: ({ children }: any) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  XAxis: () => <div />,
  YAxis: () => <div />,
  CartesianGrid: () => <div />,
  Tooltip: () => <div />,
}));

describe('RevenueChart', () => {
  const data = [
    { name: 'Jan', revenue: 1000, discounts: 100 },
    { name: 'Feb', revenue: 1500, discounts: 150 },
  ];

  it('renders card title', () => {
    render(<RevenueChart data={data} />);
    expect(screen.getByText('Revenue & Discounts')).toBeInTheDocument();
  });

  it('renders description', () => {
    render(<RevenueChart data={data} />);
    expect(screen.getByText(/Comparing generated revenue/)).toBeInTheDocument();
  });

  it('renders chart container', () => {
    render(<RevenueChart data={data} />);
    expect(screen.getByTestId('chart-container')).toBeInTheDocument();
  });
});
