import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DiscountConfigSection } from '@/presentation/pages/settings/DiscountConfigSection';

const priorities = [
  { type: 'SEASONAL', displayName: 'Seasonal' },
  { type: 'PRODUCT_BASED', displayName: 'Product Based' },
];

describe('DiscountConfigSection', () => {
  const base = {
    capType: 'PERCENTAGE' as const,
    maxCap: '25',
    currency: 'CLP',
    roundingRule: 'ROUND_HALF_UP',
    priorities,
    saving: false,
    onCapTypeChange: vi.fn(),
    onMaxCapChange: vi.fn(),
    onCurrencyChange: vi.fn(),
    onRoundingRuleChange: vi.fn(),
    onMovePriority: vi.fn(),
    onSave: vi.fn(),
  };

  it('renders Cap Type select', () => {
    render(<DiscountConfigSection {...base} />);
    expect(screen.getByLabelText('Cap Type')).toBeInTheDocument();
  });

  it('renders Max Percentage label when PERCENTAGE', () => {
    render(<DiscountConfigSection {...base} />);
    expect(screen.getByLabelText('Max Percentage')).toBeInTheDocument();
  });

  it('renders Max Amount label when FIXED', () => {
    render(<DiscountConfigSection {...base} capType="FIXED" />);
    expect(screen.getByLabelText('Max Amount')).toBeInTheDocument();
  });

  it('renders Currency input', () => {
    render(<DiscountConfigSection {...base} />);
    expect(screen.getByLabelText('Currency')).toBeInTheDocument();
  });

  it('renders Rounding Rule select', () => {
    render(<DiscountConfigSection {...base} />);
    expect(screen.getByLabelText('Rounding Rule')).toBeInTheDocument();
  });

  it('renders priority items', () => {
    render(<DiscountConfigSection {...base} />);
    expect(screen.getByText('Seasonal')).toBeInTheDocument();
    expect(screen.getByText('Product Based')).toBeInTheDocument();
  });

  it('renders Save Configuration button', () => {
    render(<DiscountConfigSection {...base} />);
    expect(screen.getByText('Save Configuration')).toBeInTheDocument();
  });

  it('calls onSave on button click', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(<DiscountConfigSection {...base} onSave={onSave} />);
    await user.click(screen.getByText('Save Configuration'));
    expect(onSave).toHaveBeenCalled();
  });

  it('renders up/down buttons for priority ordering', () => {
    render(<DiscountConfigSection {...base} />);
    expect(screen.getAllByText('↑').length).toBe(2);
    expect(screen.getAllByText('↓').length).toBe(2);
  });

  it('calls onMovePriority when up button clicked', async () => {
    const user = userEvent.setup();
    const onMovePriority = vi.fn();
    render(<DiscountConfigSection {...base} onMovePriority={onMovePriority} />);
    const upButtons = screen.getAllByText('↑');
    await user.click(upButtons[1]); // second item up
    expect(onMovePriority).toHaveBeenCalledWith(1, 'up');
  });

  it('calls onMovePriority when down button clicked', async () => {
    const user = userEvent.setup();
    const onMovePriority = vi.fn();
    render(<DiscountConfigSection {...base} onMovePriority={onMovePriority} />);
    const downButtons = screen.getAllByText('↓');
    await user.click(downButtons[0]); // first item down
    expect(onMovePriority).toHaveBeenCalledWith(0, 'down');
  });

  it('calls onCapTypeChange on select change', async () => {
    const user = userEvent.setup();
    const onCapTypeChange = vi.fn();
    render(<DiscountConfigSection {...base} onCapTypeChange={onCapTypeChange} />);
    await user.selectOptions(screen.getByLabelText('Cap Type'), 'FIXED');
    expect(onCapTypeChange).toHaveBeenCalledWith('FIXED');
  });

  it('calls onMaxCapChange on input change', async () => {
    const user = userEvent.setup();
    const onMaxCapChange = vi.fn();
    render(<DiscountConfigSection {...base} onMaxCapChange={onMaxCapChange} />);
    await user.type(screen.getByLabelText('Max Percentage'), '5');
    expect(onMaxCapChange).toHaveBeenCalled();
  });

  it('calls onCurrencyChange on input change', async () => {
    const user = userEvent.setup();
    const onCurrencyChange = vi.fn();
    render(<DiscountConfigSection {...base} onCurrencyChange={onCurrencyChange} />);
    await user.clear(screen.getByLabelText('Currency'));
    await user.type(screen.getByLabelText('Currency'), 'USD');
    expect(onCurrencyChange).toHaveBeenCalled();
  });

  it('calls onRoundingRuleChange on select change', async () => {
    const user = userEvent.setup();
    const onRoundingRuleChange = vi.fn();
    render(<DiscountConfigSection {...base} onRoundingRuleChange={onRoundingRuleChange} />);
    await user.selectOptions(screen.getByLabelText('Rounding Rule'), 'ROUND_UP');
    expect(onRoundingRuleChange).toHaveBeenCalledWith('ROUND_UP');
  });
});
