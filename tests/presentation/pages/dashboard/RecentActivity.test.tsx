import { render, screen } from '@testing-library/react';
import { RecentActivity } from '@/presentation/pages/dashboard/RecentActivity';

describe('RecentActivity', () => {
  it('renders title', () => {
    render(<RecentActivity activity={[]} />);
    expect(screen.getByText('Recent Activity')).toBeInTheDocument();
  });

  it('renders no activity message when empty', () => {
    render(<RecentActivity activity={[]} />);
    expect(screen.getByText('No recent activity')).toBeInTheDocument();
  });

  it('renders activity items', () => {
    const activity = [
      { store: 'Store A', action: 'created a rule', time: '2 hours ago' },
      { store: 'Store B', action: 'updated tiers', time: '3 hours ago' },
    ];
    render(<RecentActivity activity={activity} />);
    expect(screen.getByText('Store A')).toBeInTheDocument();
    expect(screen.getByText('created a rule')).toBeInTheDocument();
    expect(screen.getByText('Store B')).toBeInTheDocument();
    expect(screen.getByText('2 hours ago')).toBeInTheDocument();
  });
});
