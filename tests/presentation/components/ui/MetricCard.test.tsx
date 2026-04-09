import { render, screen } from '@testing-library/react';
import { MetricCard } from '@/presentation/components/ui/MetricCard';
import { Users } from 'lucide-react';

describe('MetricCard', () => {
  it('renders label and value', () => {
    render(<MetricCard label="Total Users" value={150} icon={Users} />);
    expect(screen.getByText('Total Users')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument();
  });

  it('renders string value', () => {
    render(<MetricCard label="Revenue" value="$5,000" icon={Users} />);
    expect(screen.getByText('$5,000')).toBeInTheDocument();
  });

  it('renders trend when positive', () => {
    render(<MetricCard label="Sales" value={100} icon={Users} trend={{ value: 12, label: 'vs last month' }} />);
    expect(screen.getByText('+12%')).toBeInTheDocument();
    expect(screen.getByText('vs last month')).toBeInTheDocument();
  });

  it('renders trend when negative', () => {
    render(<MetricCard label="Sales" value={100} icon={Users} trend={{ value: -5, label: 'vs last month' }} />);
    expect(screen.getByText('-5%')).toBeInTheDocument();
  });

  it('does not render trend when not provided', () => {
    const { container } = render(<MetricCard label="Test" value={0} icon={Users} />);
    expect(container.querySelector('.text-emerald-600')).not.toBeInTheDocument();
    expect(container.querySelector('.text-rose-600')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<MetricCard label="Test" value={0} icon={Users} className="my-class" />);
    expect(container.querySelector('.my-class')).toBeInTheDocument();
  });
});
