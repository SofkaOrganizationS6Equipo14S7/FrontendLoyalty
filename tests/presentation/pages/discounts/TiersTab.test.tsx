import { render, screen } from '@testing-library/react';
import { TiersTab } from '@/presentation/pages/discounts/TiersTab';
import type { CustomerTierResponse } from '@/domain/types';

const tier: CustomerTierResponse = {
  id: 't1',
  name: 'Gold',
  discountPercentage: 15,
  hierarchyLevel: 1,
  isActive: true,
} as CustomerTierResponse;

describe('TiersTab', () => {
  const base = {
    tiers: [tier],
    isAdmin: true,
    expandedTier: null,
    classRules: {},
    onCreateTier: vi.fn(),
    onEditTier: vi.fn(),
    onDeleteTier: vi.fn(),
    onActivateTier: vi.fn(),
    onToggleExpand: vi.fn(),
    onCreateClassRule: vi.fn(),
    onEditClassRule: vi.fn(),
    onDeleteClassRule: vi.fn(),
  };

  it('renders title with count', () => {
    render(<TiersTab {...base} />);
    expect(screen.getByText('Loyalty Tiers')).toBeInTheDocument();
    expect(screen.getByText('1 Total')).toBeInTheDocument();
  });

  it('renders Add Tier button for admin', () => {
    render(<TiersTab {...base} />);
    expect(screen.getByText('Add Tier')).toBeInTheDocument();
  });

  it('renders tier card', () => {
    render(<TiersTab {...base} />);
    expect(screen.getByText('Gold')).toBeInTheDocument();
  });

  it('renders empty state', () => {
    render(<TiersTab {...base} tiers={[]} />);
    expect(screen.getByText('No tiers configured')).toBeInTheDocument();
  });
});
