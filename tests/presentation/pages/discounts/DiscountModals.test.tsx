import { render, screen } from '@testing-library/react';
import { DiscountModals } from '@/presentation/pages/discounts/DiscountModals';

describe('DiscountModals', () => {
  const ruleState = {
    showForm: false,
    editingRule: null,
    form: { name: '', description: '', discountPercentage: '', discountPriorityId: '', attrs: {} },
    attributes: [],
    priorities: [],
    saving: false,
    setShowForm: vi.fn(),
    setForm: vi.fn(),
    handleSave: vi.fn(),
    deleteTarget: null,
    setDeleteTarget: vi.fn(),
    handleDelete: vi.fn(),
    showTierAssign: false,
    setShowTierAssign: vi.fn(),
    assignedTiers: [],
    selectedTierIds: [],
    handleToggleTier: vi.fn(),
    handleAssignTiers: vi.fn(),
  } as any;

  const tierState = {
    showForm: false,
    editingTier: null,
    form: { name: '', discountPercentage: '', hierarchyLevel: '' },
    saving: false,
    setShowForm: vi.fn(),
    setForm: vi.fn(),
    handleSave: vi.fn(),
    deleteTarget: null,
    setDeleteTarget: vi.fn(),
    handleDelete: vi.fn(),
    tiers: [],
    showClassForm: false,
    editingClassRule: null,
    classForm: { metricType: '', minValue: '', maxValue: '', priority: '' },
    savingClass: false,
    setShowClassForm: vi.fn(),
    setClassForm: vi.fn(),
    handleClassSave: vi.fn(),
  } as any;

  it('renders without crashing when all modals are closed', () => {
    const { container } = render(<DiscountModals ruleState={ruleState} tierState={tierState} />);
    expect(container).toBeInTheDocument();
  });

  it('renders delete rule confirm when deleteTarget set', () => {
    const ruleStateWithDelete = { ...ruleState, deleteTarget: { name: 'Test Rule' } };
    render(<DiscountModals ruleState={ruleStateWithDelete} tierState={tierState} />);
    expect(screen.getByText(/Delete Rule/)).toBeInTheDocument();
  });

  it('renders rule form modal when showForm is true', () => {
    const ruleStateWithForm = { ...ruleState, showForm: true };
    render(<DiscountModals ruleState={ruleStateWithForm} tierState={tierState} />);
    expect(screen.getByText('Rule Name')).toBeInTheDocument();
  });

  it('renders tier form modal when showForm is true', () => {
    const tierStateWithForm = { ...tierState, showForm: true };
    render(<DiscountModals ruleState={ruleState} tierState={tierStateWithForm} />);
    expect(screen.getByText('Tier Name')).toBeInTheDocument();
  });

  it('renders delete tier confirm when deleteTarget set', () => {
    const tierStateWithDelete = { ...tierState, deleteTarget: { name: 'Gold Tier' } };
    render(<DiscountModals ruleState={ruleState} tierState={tierStateWithDelete} />);
    expect(screen.getByText(/Delete Tier/)).toBeInTheDocument();
  });

  it('renders classification rule modal when showClassForm is true', () => {
    const tierStateWithClass = { ...tierState, showClassForm: true };
    render(<DiscountModals ruleState={ruleState} tierState={tierStateWithClass} />);
    expect(screen.getByText('Metric Type')).toBeInTheDocument();
  });

  it('renders tier assign modal when showTierAssign is true', () => {
    const ruleStateWithAssign = { ...ruleState, showTierAssign: true };
    render(<DiscountModals ruleState={ruleStateWithAssign} tierState={tierState} />);
    expect(screen.getByText('Assign Tiers to Rule')).toBeInTheDocument();
  });
});
