import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TierFormModal } from '@/presentation/pages/discounts/TierFormModal';

describe('TierFormModal', () => {
  const base = {
    isOpen: true,
    editingTier: null,
    form: { name: '', discountPercentage: '', hierarchyLevel: '' },
    saving: false,
    onClose: vi.fn(),
    onFormChange: vi.fn(),
    onSave: vi.fn(),
  };

  it('renders Create Tier title', () => {
    render(<TierFormModal {...base} />);
    expect(screen.getAllByText('Create Tier').length).toBeGreaterThanOrEqual(1);
  });

  it('renders Edit Tier title when editing', () => {
    render(<TierFormModal {...base} editingTier={{ id: 't1' } as any} />);
    expect(screen.getByText('Edit Tier')).toBeInTheDocument();
  });

  it('renders form fields', () => {
    render(<TierFormModal {...base} />);
    expect(screen.getByLabelText('Tier Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Discount %')).toBeInTheDocument();
    expect(screen.getByLabelText('Hierarchy Level')).toBeInTheDocument();
  });

  it('calls onFormChange when tier name changes', async () => {
    const user = userEvent.setup();
    const onFormChange = vi.fn();
    render(<TierFormModal {...base} onFormChange={onFormChange} />);
    await user.type(screen.getByLabelText('Tier Name'), 'G');
    expect(onFormChange).toHaveBeenCalled();
  });

  it('calls onFormChange when discount % changes', async () => {
    const user = userEvent.setup();
    const onFormChange = vi.fn();
    render(<TierFormModal {...base} onFormChange={onFormChange} />);
    await user.type(screen.getByLabelText('Discount %'), '5');
    expect(onFormChange).toHaveBeenCalled();
  });

  it('calls onFormChange when hierarchy level changes', async () => {
    const user = userEvent.setup();
    const onFormChange = vi.fn();
    render(<TierFormModal {...base} onFormChange={onFormChange} />);
    await user.type(screen.getByLabelText('Hierarchy Level'), '1');
    expect(onFormChange).toHaveBeenCalled();
  });

  it('renders Save Changes button when editing', () => {
    render(<TierFormModal {...base} editingTier={{ id: 't1' } as any} />);
    expect(screen.getByRole('button', { name: 'Save Changes' })).toBeInTheDocument();
  });
});
