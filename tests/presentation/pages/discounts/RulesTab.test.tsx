import { render, screen } from '@testing-library/react';
import { RulesTab } from '@/presentation/pages/discounts/RulesTab';
import type { RuleResponse } from '@/domain/types';

const rule: RuleResponse = {
  id: 'r1',
  name: 'Summer Sale',
  discountPercentage: 20,
  isActive: true,
} as RuleResponse;

describe('RulesTab', () => {
  const base = {
    rules: [rule],
    tabLabel: 'Seasonal',
    isAdmin: true,
    onCreateRule: vi.fn(),
    onEditRule: vi.fn(),
    onDeleteRule: vi.fn(),
    onToggleActive: vi.fn(),
    onAssignTiers: vi.fn(),
  };

  it('renders tab title with count', () => {
    render(<RulesTab {...base} />);
    expect(screen.getByText('Seasonal Rules')).toBeInTheDocument();
    expect(screen.getByText('1 Total')).toBeInTheDocument();
  });

  it('renders Add Rule button for admin', () => {
    render(<RulesTab {...base} />);
    expect(screen.getByText('Add Rule')).toBeInTheDocument();
  });

  it('hides Add Rule button for non-admin', () => {
    render(<RulesTab {...base} isAdmin={false} />);
    expect(screen.queryByText('Add Rule')).not.toBeInTheDocument();
  });

  it('renders rules', () => {
    render(<RulesTab {...base} />);
    expect(screen.getByText('Summer Sale')).toBeInTheDocument();
  });

  it('renders empty state when no rules', () => {
    render(<RulesTab {...base} rules={[]} />);
    expect(screen.getByText('No rules configured')).toBeInTheDocument();
  });
});
