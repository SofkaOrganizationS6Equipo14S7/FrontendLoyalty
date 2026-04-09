import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TierAssignModal } from '@/presentation/pages/discounts/TierAssignModal';
import type { CustomerTierResponse } from '@/domain/types';

const tier: CustomerTierResponse = {
  id: 't1',
  name: 'Gold',
  discountPercentage: 15,
  hierarchyLevel: 1,
  isActive: true,
} as CustomerTierResponse;

describe('TierAssignModal', () => {
  const base = {
    isOpen: true,
    tiers: [tier],
    assignedTiers: [],
    selectedTierIds: [],
    onClose: vi.fn(),
    onToggleTier: vi.fn(),
    onSave: vi.fn(),
  };

  it('renders title', () => {
    render(<TierAssignModal {...base} />);
    expect(screen.getByText('Assign Tiers to Rule')).toBeInTheDocument();
  });

  it('renders tier checkbox', () => {
    render(<TierAssignModal {...base} />);
    expect(screen.getByText('Gold')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('shows Linked badge for assigned tiers', () => {
    render(<TierAssignModal {...base} assignedTiers={[{ customerTierId: 't1' }] as any} />);
    expect(screen.getByText('Linked')).toBeInTheDocument();
  });

  it('renders Save Assignment button', () => {
    render(<TierAssignModal {...base} />);
    expect(screen.getByText('Save Assignment')).toBeInTheDocument();
  });

  it('calls onToggleTier on checkbox change', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(<TierAssignModal {...base} onToggleTier={onToggle} />);
    await user.click(screen.getByRole('checkbox'));
    expect(onToggle).toHaveBeenCalledWith('t1', true);
  });

  it('renders empty state when no tiers', () => {
    render(<TierAssignModal {...base} tiers={[]} />);
    expect(screen.getByText(/No tiers available/)).toBeInTheDocument();
  });
});
