import { render, screen } from '@testing-library/react';
import { RuleCard } from '@/presentation/pages/discounts/RuleCard';
import type { RuleResponse } from '@/domain/types';

const rule: RuleResponse = {
  id: 'r1',
  name: 'Winter Deal',
  discountPercentage: 30,
  isActive: true,
} as RuleResponse;

describe('RuleCard', () => {
  const base = {
    rule,
    index: 0,
    totalRules: 3,
    isAdmin: true,
    onEdit: vi.fn(),
    onDelete: vi.fn(),
    onToggleActive: vi.fn(),
    onAssignTiers: vi.fn(),
  };

  it('renders rule name', () => {
    render(<RuleCard {...base} />);
    expect(screen.getByText('Winter Deal')).toBeInTheDocument();
  });

  it('renders discount percentage', () => {
    render(<RuleCard {...base} />);
    expect(screen.getByText('30%')).toBeInTheDocument();
  });

  it('renders priority indicator', () => {
    render(<RuleCard {...base} />);
    expect(screen.getByText('P1')).toBeInTheDocument();
  });

  it('shows On label when active', () => {
    render(<RuleCard {...base} />);
    expect(screen.getByText('On')).toBeInTheDocument();
  });

  it('shows Off and Inactive when not active', () => {
    render(<RuleCard {...base} rule={{ ...rule, isActive: false }} />);
    expect(screen.getByText('Off')).toBeInTheDocument();
    expect(screen.getByText('Inactive')).toBeInTheDocument();
  });

  it('renders admin actions: Edit, Delete', () => {
    render(<RuleCard {...base} />);
    expect(screen.getByText('Edit')).toBeInTheDocument();
  });

  it('hides admin actions for non-admin', () => {
    render(<RuleCard {...base} isAdmin={false} />);
    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
  });

  it('calls onEdit on Edit click', () => {
    const onEdit = vi.fn();
    render(<RuleCard {...base} onEdit={onEdit} />);
    screen.getByText('Edit').click();
    expect(onEdit).toHaveBeenCalledWith(rule);
  });

  it('calls onDelete on delete button click', () => {
    const onDelete = vi.fn();
    render(<RuleCard {...base} onDelete={onDelete} />);
    // The delete button is a ghost icon button with red text, contains Trash2 icon
    const btns = screen.getAllByRole('button');
    const trashBtn = btns.find(b => b.textContent === '' && b.querySelector('svg.lucide-trash-2'));
    trashBtn?.click();
    expect(onDelete).toHaveBeenCalledWith(rule);
  });

  it('calls onToggleActive on switch click', () => {
    const onToggleActive = vi.fn();
    render(<RuleCard {...base} onToggleActive={onToggleActive} />);
    const switchEl = screen.getByRole('switch');
    switchEl.click();
    expect(onToggleActive).toHaveBeenCalledWith(rule);
  });

  it('calls onAssignTiers on Assign Tiers click', () => {
    const onAssignTiers = vi.fn();
    render(<RuleCard {...base} onAssignTiers={onAssignTiers} />);
    screen.getByTitle('Assign Tiers').click();
    expect(onAssignTiers).toHaveBeenCalledWith(rule);
  });

  it('renders priority P2 for index 1', () => {
    render(<RuleCard {...base} index={1} />);
    expect(screen.getByText('P2')).toBeInTheDocument();
  });
});
