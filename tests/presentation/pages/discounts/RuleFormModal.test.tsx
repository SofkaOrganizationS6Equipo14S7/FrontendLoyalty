import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RuleFormModal } from '@/presentation/pages/discounts/RuleFormModal';

describe('RuleFormModal', () => {
  const base = {
    isOpen: true,
    editingRule: null,
    form: { name: '', description: '', discountPercentage: '', discountPriorityId: '', attrs: {} },
    attributes: [],
    priorities: [],
    saving: false,
    onClose: vi.fn(),
    onFormChange: vi.fn(),
    onSave: vi.fn(),
  };

  it('renders Create Rule title when not editing', () => {
    render(<RuleFormModal {...base} />);
    expect(screen.getAllByText('Create Rule').length).toBeGreaterThanOrEqual(1);
  });

  it('renders Edit Rule title when editing', () => {
    render(<RuleFormModal {...base} editingRule={{ id: 'r1' } as any} />);
    expect(screen.getByText('Edit Rule')).toBeInTheDocument();
  });

  it('renders form fields', () => {
    render(<RuleFormModal {...base} />);
    expect(screen.getByLabelText('Rule Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByLabelText('Discount %')).toBeInTheDocument();
  });

  it('renders priority select when priorities exist', () => {
    const priorities = [{ id: 'p1', priorityLevel: 1 }] as any[];
    render(<RuleFormModal {...base} priorities={priorities} />);
    expect(screen.getByLabelText('Priority')).toBeInTheDocument();
  });

  it('renders attribute fields', () => {
    const attributes = [{ id: 'a1', attributeName: 'start_date' }] as any[];
    render(<RuleFormModal {...base} attributes={attributes} />);
    expect(screen.getByLabelText('Start Date')).toBeInTheDocument();
  });

  it('renders submit button', () => {
    render(<RuleFormModal {...base} />);
    expect(screen.getByRole('button', { name: 'Create Rule' })).toBeInTheDocument();
  });

  it('calls onFormChange when name changes', async () => {
    const user = userEvent.setup();
    const onFormChange = vi.fn();
    render(<RuleFormModal {...base} onFormChange={onFormChange} />);
    await user.type(screen.getByLabelText('Rule Name'), 'A');
    expect(onFormChange).toHaveBeenCalled();
  });

  it('calls onFormChange when description changes', async () => {
    const user = userEvent.setup();
    const onFormChange = vi.fn();
    render(<RuleFormModal {...base} onFormChange={onFormChange} />);
    await user.type(screen.getByLabelText('Description'), 'D');
    expect(onFormChange).toHaveBeenCalled();
  });

  it('calls onFormChange when discount percentage changes', async () => {
    const user = userEvent.setup();
    const onFormChange = vi.fn();
    render(<RuleFormModal {...base} onFormChange={onFormChange} />);
    await user.type(screen.getByLabelText('Discount %'), '5');
    expect(onFormChange).toHaveBeenCalled();
  });

  it('calls onFormChange when priority changes', async () => {
    const user = userEvent.setup();
    const onFormChange = vi.fn();
    const priorities = [{ id: 'p1', priorityLevel: 1 }, { id: 'p2', priorityLevel: 2 }] as any[];
    render(<RuleFormModal {...base} onFormChange={onFormChange} priorities={priorities} />);
    await user.selectOptions(screen.getByLabelText('Priority'), 'p2');
    expect(onFormChange).toHaveBeenCalled();
  });

  it('calls onFormChange when attribute changes', async () => {
    const user = userEvent.setup();
    const onFormChange = vi.fn();
    const attributes = [{ id: 'a1', attributeName: 'product_name' }] as any[];
    render(<RuleFormModal {...base} onFormChange={onFormChange} attributes={attributes} />);
    await user.type(screen.getByLabelText('Product Name'), 'X');
    expect(onFormChange).toHaveBeenCalled();
  });

  it('renders date type input for date attributes', () => {
    const attributes = [{ id: 'a1', attributeName: 'start_date' }] as any[];
    render(<RuleFormModal {...base} attributes={attributes} />);
    const input = screen.getByLabelText('Start Date');
    expect(input).toHaveAttribute('type', 'date');
  });

  it('renders text type input for non-date attributes', () => {
    const attributes = [{ id: 'a1', attributeName: 'product_name' }] as any[];
    render(<RuleFormModal {...base} attributes={attributes} />);
    const input = screen.getByLabelText('Product Name');
    expect(input).toHaveAttribute('type', 'text');
  });
});
