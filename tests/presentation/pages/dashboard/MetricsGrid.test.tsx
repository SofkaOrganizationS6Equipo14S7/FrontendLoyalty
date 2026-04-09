import { render, screen } from '@testing-library/react';
import { MetricsGrid } from '@/presentation/pages/dashboard/MetricsGrid';

describe('MetricsGrid', () => {
  it('renders all metric cards with null metrics', () => {
    render(<MetricsGrid metrics={null} />);
    expect(screen.getByText('Total Revenue')).toBeInTheDocument();
    expect(screen.getByText('Active Discounts')).toBeInTheDocument();
    expect(screen.getByText('Total Users')).toBeInTheDocument();
    expect(screen.getByText('Active Stores')).toBeInTheDocument();
  });

  it('renders formatted values', () => {
    render(<MetricsGrid metrics={{
      totalRevenue: 12500.5,
      activeDiscounts: 8,
      totalUsers: 1500,
      activeStores: 3,
    }} />);
    expect(screen.getByText(/12.*500/)).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('renders zero values when metrics are zero', () => {
    render(<MetricsGrid metrics={{
      totalRevenue: 0,
      activeDiscounts: 0,
      totalUsers: 0,
      activeStores: 0,
    }} />);
    expect(screen.getByText('$0.00')).toBeInTheDocument();
  });

  it('renders descriptions', () => {
    render(<MetricsGrid metrics={null} />);
    expect(screen.getByText('Total accumulated revenue')).toBeInTheDocument();
    expect(screen.getByText('Currently active discount rules')).toBeInTheDocument();
  });
});
