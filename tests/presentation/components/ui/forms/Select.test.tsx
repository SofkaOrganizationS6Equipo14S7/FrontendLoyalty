import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select } from '@/presentation/components/ui/forms/Select';

const options = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
];

describe('Select', () => {
  it('renders options', () => {
    render(<Select options={options} />);
    expect(screen.getByText('Option A')).toBeInTheDocument();
    expect(screen.getByText('Option B')).toBeInTheDocument();
  });

  it('renders label and associates it', () => {
    render(<Select label="Country" options={options} />);
    expect(screen.getByLabelText('Country')).toBeInTheDocument();
  });

  it('generates id from label', () => {
    render(<Select label="My Select" options={options} />);
    expect(screen.getByLabelText('My Select').id).toBe('my-select');
  });

  it('uses provided id', () => {
    render(<Select label="X" id="custom" options={options} />);
    expect(screen.getByLabelText('X').id).toBe('custom');
  });

  it('renders placeholder as disabled option', () => {
    render(<Select options={options} placeholder="Choose..." />);
    const placeholder = screen.getByText('Choose...');
    expect(placeholder).toBeInTheDocument();
    expect(placeholder).toBeDisabled();
  });

  it('shows error message', () => {
    render(<Select options={options} error="Required" />);
    expect(screen.getByText('Required')).toBeInTheDocument();
  });

  it('applies error styling', () => {
    render(<Select options={options} error="Error" data-testid="sel" />);
    expect(screen.getByTestId('sel').className).toContain('border-red-400');
  });

  it('handles selection change', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Select options={options} onChange={onChange} data-testid="sel" />);
    await user.selectOptions(screen.getByTestId('sel'), 'b');
    expect(onChange).toHaveBeenCalled();
  });

  it('forwards ref', () => {
    const ref = { current: null } as React.RefObject<HTMLSelectElement | null>;
    render(<Select ref={ref} options={options} />);
    expect(ref.current).toBeInstanceOf(HTMLSelectElement);
  });

  it('has displayName', () => {
    expect(Select.displayName).toBe('Select');
  });
});
