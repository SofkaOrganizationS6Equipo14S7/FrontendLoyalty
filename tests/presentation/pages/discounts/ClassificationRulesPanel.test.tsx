import { render, screen } from '@testing-library/react';
import { ClassificationRulesPanel } from '@/presentation/pages/discounts/ClassificationRulesPanel';
import type { ClassificationRuleResponse } from '@/domain/types';

const rule: ClassificationRuleResponse = {
  id: 'cr1',
  metricType: 'TOTAL_PURCHASES',
  minValue: 0,
  maxValue: 1000,
  priority: 1,
} as ClassificationRuleResponse;

describe('ClassificationRulesPanel', () => {
  const base = {
    tierId: 't1',
    rules: [rule],
    isAdmin: true,
    onCreateRule: vi.fn(),
    onEditRule: vi.fn(),
    onDeleteRule: vi.fn(),
  };

  it('renders title', () => {
    render(<ClassificationRulesPanel {...base} />);
    expect(screen.getByText('Classification Rules')).toBeInTheDocument();
  });

  it('renders Add button for admin', () => {
    render(<ClassificationRulesPanel {...base} />);
    expect(screen.getByText('Add')).toBeInTheDocument();
  });

  it('hides Add button for non-admin', () => {
    render(<ClassificationRulesPanel {...base} isAdmin={false} />);
    expect(screen.queryByText('Add')).not.toBeInTheDocument();
  });

  it('renders rule metrics', () => {
    render(<ClassificationRulesPanel {...base} />);
    expect(screen.getByText('TOTAL_PURCHASES')).toBeInTheDocument();
  });

  it('renders empty state when no rules', () => {
    render(<ClassificationRulesPanel {...base} rules={[]} />);
    expect(screen.getByText(/No classification rules/)).toBeInTheDocument();
  });

  it('renders table headers when rules exist', () => {
    render(<ClassificationRulesPanel {...base} />);
    expect(screen.getByText('Metric')).toBeInTheDocument();
    expect(screen.getByText('Min')).toBeInTheDocument();
    expect(screen.getByText('Max')).toBeInTheDocument();
  });

  it('calls onCreateRule when Add clicked', async () => {
    const user = (await import('@testing-library/user-event')).default.setup();
    const onCreateRule = vi.fn();
    render(<ClassificationRulesPanel {...base} onCreateRule={onCreateRule} />);
    await user.click(screen.getByText('Add'));
    expect(onCreateRule).toHaveBeenCalledWith('t1');
  });

  it('calls onEditRule when edit button clicked', () => {
    const onEditRule = vi.fn();
    render(<ClassificationRulesPanel {...base} onEditRule={onEditRule} />);
    const btns = screen.getAllByRole('button');
    // First icon button in actions column is edit
    const editBtn = btns.find(b => b.querySelector('svg') && !b.classList.contains('text-red-500') && b !== screen.getByText('Add'));
    editBtn?.click();
    expect(onEditRule).toHaveBeenCalled();
  });

  it('calls onDeleteRule when delete button clicked', () => {
    const onDeleteRule = vi.fn();
    render(<ClassificationRulesPanel {...base} onDeleteRule={onDeleteRule} />);
    const btns = screen.getAllByRole('button');
    const trashBtn = btns.find(b => b.classList.contains('text-red-500'));
    trashBtn?.click();
    expect(onDeleteRule).toHaveBeenCalledWith('t1', 'cr1');
  });

  it('hides action column for non-admin', () => {
    render(<ClassificationRulesPanel {...base} isAdmin={false} />);
    expect(screen.queryByText('Actions')).not.toBeInTheDocument();
  });
});
