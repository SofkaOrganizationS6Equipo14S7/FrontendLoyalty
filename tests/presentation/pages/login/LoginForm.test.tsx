import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from '@/presentation/pages/login/LoginForm';

describe('LoginForm', () => {
  const base = { onSubmit: vi.fn().mockResolvedValue(undefined), error: '', loading: false };

  it('renders username and password fields', () => {
    render(<LoginForm {...base} />);
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('renders Sign In button', () => {
    render(<LoginForm {...base} />);
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  it('calls onSubmit with credentials', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<LoginForm {...base} onSubmit={onSubmit} />);
    await user.type(screen.getByLabelText('Username'), 'admin');
    await user.type(screen.getByLabelText('Password'), 'pass123');
    await user.click(screen.getByText('Sign In'));
    expect(onSubmit).toHaveBeenCalledWith('admin', 'pass123');
  });

  it('shows error message', () => {
    render(<LoginForm {...base} error="Invalid credentials" />);
    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
  });

  it('toggles password visibility', async () => {
    const user = userEvent.setup();
    render(<LoginForm {...base} />);
    const passwordInput = screen.getByLabelText('Password');
    expect(passwordInput).toHaveAttribute('type', 'password');
    // Click the toggle button (there's an eye icon button)
    const buttons = screen.getAllByRole('button');
    const toggleBtn = buttons.find(b => b.getAttribute('type') === 'button');
    await user.click(toggleBtn!);
    expect(passwordInput).toHaveAttribute('type', 'text');
  });
});
