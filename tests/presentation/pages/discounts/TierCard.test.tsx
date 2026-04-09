import { render, screen } from '@testing-library/react';
import { TierCard } from '@/presentation/pages/discounts/TierCard';
import type { CustomerTierResponse } from '@/domain/types';

const tier: CustomerTierResponse = {
  id: 't1',
  name: 'Silver',
  discountPercentage: 10,
  hierarchyLevel: 2,
  isActive: true,
} as CustomerTierResponse;

describe('TierCard', () => {
  const base = {
    tier,
    isAdmin: true,
    isExpanded: false,
    classRules: [],
    onEdit: vi.fn(),
    onDelete: vi.fn(),
    onActivate: vi.fn(),
    onToggleExpand: vi.fn(),
    onCreateClassRule: vi.fn(),
    onEditClassRule: vi.fn(),
    onDeleteClassRule: vi.fn(),
  };

  it('renders tier name', () => {
    render(<TierCard {...base} />);
    expect(screen.getByText('Silver')).toBeInTheDocument();
  });

  it('renders level and discount info', () => {
    render(<TierCard {...base} />);
    expect(screen.getByText(/Level 2/)).toBeInTheDocument();
    expect(screen.getByText(/10% discount/)).toBeInTheDocument();
  });

  it('renders status badge', () => {
    render(<TierCard {...base} />);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('does not render classification panel when collapsed', () => {
    render(<TierCard {...base} />);
    expect(screen.queryByText('Classification Rules')).not.toBeInTheDocument();
  });

  it('renders classification panel when expanded', () => {
    render(<TierCard {...base} isExpanded={true} />);
    expect(screen.getByText('Classification Rules')).toBeInTheDocument();
  });

  it('calls onToggleExpand on card click', () => {
    const onToggle = vi.fn();
    render(<TierCard {...base} onToggleExpand={onToggle} />);
    screen.getByText('Silver').click();
    expect(onToggle).toHaveBeenCalledWith('t1');
  });

  it('calls onEdit when edit button clicked', () => {
    const onEdit = vi.fn();
    render(<TierCard {...base} onEdit={onEdit} />);
    const editBtns = screen.getAllByRole('button');
    // Find pencil/edit button (ghost button)
    const editBtn = editBtns.find(b => !b.classList.contains('text-red-500') && !b.textContent?.includes('Active'));
    editBtn?.click();
    expect(onEdit).toHaveBeenCalled();
  });

  it('calls onDelete when delete button clicked', () => {
    const onDelete = vi.fn();
    render(<TierCard {...base} onDelete={onDelete} />);
    const btns = screen.getAllByRole('button');
    const trashBtn = btns.find(b => b.classList.contains('text-red-500'));
    trashBtn?.click();
    expect(onDelete).toHaveBeenCalledWith(tier);
  });

  it('shows reactivate button for inactive tier', () => {
    const inactiveTier = { ...tier, isActive: false };
    render(<TierCard {...base} tier={inactiveTier} />);
    expect(screen.getByTitle('Reactivate')).toBeInTheDocument();
  });

  it('calls onActivate on reactivate click', () => {
    const inactiveTier = { ...tier, isActive: false };
    const onActivate = vi.fn();
    render(<TierCard {...base} tier={inactiveTier} onActivate={onActivate} />);
    screen.getByTitle('Reactivate').click();
    expect(onActivate).toHaveBeenCalledWith(inactiveTier);
  });

  it('hides admin buttons for non-admin', () => {
    render(<TierCard {...base} isAdmin={false} />);
    expect(screen.queryByTitle('Reactivate')).not.toBeInTheDocument();
  });

  it('renders null discount as 0%', () => {
    const tierNullDiscount = { ...tier, discountPercentage: null } as any;
    render(<TierCard {...base} tier={tierNullDiscount} />);
    expect(screen.getByText(/0% discount/)).toBeInTheDocument();
  });
});
