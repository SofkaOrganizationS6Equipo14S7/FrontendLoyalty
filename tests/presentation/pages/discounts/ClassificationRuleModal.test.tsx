import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ClassificationRuleModal } from '@/presentation/pages/discounts/ClassificationRuleModal';

describe('ClassificationRuleModal', () => {
  const base = {
    isOpen: true,
    editingRule: null,
    form: { metricType: '', minValue: '', maxValue: '', priority: '' },
    saving: false,
    onClose: vi.fn(),
    onFormChange: vi.fn(),
    onSave: vi.fn(),
  };

  it('renders Add Classification Rule title', () => {
    render(<ClassificationRuleModal {...base} />);
    expect(screen.getByText('Add Classification Rule')).toBeInTheDocument();
  });

  it('renders Edit title when editing', () => {
    render(<ClassificationRuleModal {...base} editingRule={{ id: 'c1' } as any} />);
    expect(screen.getByText('Edit Classification Rule')).toBeInTheDocument();
  });

  it('renders form fields', () => {
    render(<ClassificationRuleModal {...base} />);
    expect(screen.getByLabelText('Metric Type')).toBeInTheDocument();
    expect(screen.getByLabelText('Min Value')).toBeInTheDocument();
    expect(screen.getByLabelText('Max Value')).toBeInTheDocument();
    expect(screen.getByLabelText('Priority')).toBeInTheDocument();
  });

  it('renders metric type options', () => {
    const { container } = render(<ClassificationRuleModal {...base} />);
    const select = container.querySelector('select');
    const options = select?.querySelectorAll('option');
    const texts = Array.from(options || []).map(o => o.textContent);
    expect(texts).toContain('Total Purchases');
    expect(texts).toContain('Order Count');
  });

  it('calls onFormChange when metric type changes', async () => {
    const user = userEvent.setup();
    const onFormChange = vi.fn();
    render(<ClassificationRuleModal {...base} onFormChange={onFormChange} />);
    await user.selectOptions(screen.getByLabelText('Metric Type'), 'TOTAL_PURCHASES');
    expect(onFormChange).toHaveBeenCalled();
  });

  it('calls onFormChange when min value changes', async () => {
    const user = userEvent.setup();
    const onFormChange = vi.fn();
    render(<ClassificationRuleModal {...base} onFormChange={onFormChange} />);
    await user.type(screen.getByLabelText('Min Value'), '5');
    expect(onFormChange).toHaveBeenCalled();
  });

  it('calls onFormChange when max value changes', async () => {
    const user = userEvent.setup();
    const onFormChange = vi.fn();
    render(<ClassificationRuleModal {...base} onFormChange={onFormChange} />);
    await user.type(screen.getByLabelText('Max Value'), '100');
    expect(onFormChange).toHaveBeenCalled();
  });

  it('calls onFormChange when priority changes', async () => {
    const user = userEvent.setup();
    const onFormChange = vi.fn();
    render(<ClassificationRuleModal {...base} onFormChange={onFormChange} />);
    await user.type(screen.getByLabelText('Priority'), '1');
    expect(onFormChange).toHaveBeenCalled();
  });
});
