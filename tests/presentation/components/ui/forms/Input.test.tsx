import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '@/presentation/components/ui/forms/Input';

describe('Input', () => {
  it('renders a basic input', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('renders label and associates it with input', () => {
    render(<Input label="Email" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('generates id from label', () => {
    render(<Input label="First Name" />);
    const input = screen.getByLabelText('First Name');
    expect(input.id).toBe('first-name');
  });

  it('uses provided id over generated one', () => {
    render(<Input label="Email" id="custom-id" />);
    expect(screen.getByLabelText('Email').id).toBe('custom-id');
  });

  it('shows error message', () => {
    render(<Input error="Required field" />);
    expect(screen.getByText('Required field')).toBeInTheDocument();
  });

  it('applies error styling when error is present', () => {
    render(<Input error="Error" data-testid="inp" />);
    const input = screen.getByTestId('inp');
    expect(input.className).toContain('border-red-400');
  });

  it('handles user typing', async () => {
    const user = userEvent.setup();
    render(<Input placeholder="type here" />);
    const input = screen.getByPlaceholderText('type here');
    await user.type(input, 'hello');
    expect(input).toHaveValue('hello');
  });

  it('forwards ref', () => {
    const ref = { current: null } as React.RefObject<HTMLInputElement | null>;
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('renders without wrapper div when no label or error', () => {
    const { container } = render(<Input />);
    expect(container.querySelector('.space-y-1\\.5')).toBeNull();
  });

  it('applies custom className', () => {
    render(<Input className="custom-class" data-testid="inp" />);
    expect(screen.getByTestId('inp').className).toContain('custom-class');
  });

  it('has displayName', () => {
    expect(Input.displayName).toBe('Input');
  });
});
