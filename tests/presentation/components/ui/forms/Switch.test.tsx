import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Switch } from '@/presentation/components/ui/forms/Switch';

describe('Switch', () => {
  it('renders with role switch', () => {
    render(<Switch checked={false} onCheckedChange={() => {}} />);
    expect(screen.getByRole('switch')).toBeInTheDocument();
  });

  it('reflects checked state via aria-checked', () => {
    render(<Switch checked={true} onCheckedChange={() => {}} />);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });

  it('reflects unchecked state', () => {
    render(<Switch checked={false} onCheckedChange={() => {}} />);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
  });

  it('calls onCheckedChange with toggled value on click', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Switch checked={false} onCheckedChange={onChange} />);
    await user.click(screen.getByRole('switch'));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('calls onCheckedChange with false when currently checked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Switch checked={true} onCheckedChange={onChange} />);
    await user.click(screen.getByRole('switch'));
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it('supports disabled state', () => {
    render(<Switch checked={false} onCheckedChange={() => {}} disabled />);
    expect(screen.getByRole('switch')).toBeDisabled();
  });

  it('does not call onCheckedChange when disabled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Switch checked={false} onCheckedChange={onChange} disabled />);
    await user.click(screen.getByRole('switch'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('applies custom className', () => {
    render(<Switch checked={false} onCheckedChange={() => {}} className="extra" />);
    expect(screen.getByRole('switch').className).toContain('extra');
  });

  it('applies checked styling', () => {
    render(<Switch checked={true} onCheckedChange={() => {}} />);
    expect(screen.getByRole('switch').className).toContain('bg-indigo-600');
  });

  it('applies unchecked styling', () => {
    render(<Switch checked={false} onCheckedChange={() => {}} />);
    expect(screen.getByRole('switch').className).toContain('bg-slate-200');
  });

  it('passes aria-label', () => {
    render(<Switch checked={false} onCheckedChange={() => {}} aria-label="Toggle feature" />);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-label', 'Toggle feature');
  });
});
