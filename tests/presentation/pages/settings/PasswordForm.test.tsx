import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PasswordForm } from '@/presentation/pages/settings/PasswordForm';

describe('PasswordForm', () => {
  const base = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    saving: false,
    onCurrentPasswordChange: vi.fn(),
    onNewPasswordChange: vi.fn(),
    onConfirmPasswordChange: vi.fn(),
    onSubmit: vi.fn((e: any) => e.preventDefault()),
  };

  it('renders three password fields', () => {
    render(<PasswordForm {...base} />);
    expect(screen.getByLabelText('Current Password')).toBeInTheDocument();
    expect(screen.getByLabelText('New Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
  });

  it('renders Change Password button', () => {
    render(<PasswordForm {...base} />);
    expect(screen.getByRole('button', { name: /change password/i })).toBeInTheDocument();
  });

  it('shows mismatch error when passwords differ', () => {
    render(<PasswordForm {...base} newPassword="abc" confirmPassword="xyz" />);
    expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
  });

  it('does not show error when passwords match', () => {
    render(<PasswordForm {...base} newPassword="abc" confirmPassword="abc" />);
    expect(screen.queryByText('Passwords do not match')).not.toBeInTheDocument();
  });

  it('calls onSubmit on button click', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((e: any) => e.preventDefault());
    render(<PasswordForm {...base} currentPassword="old" newPassword="new123" confirmPassword="new123" onSubmit={onSubmit} />);
    await user.click(screen.getByRole('button', { name: /change password/i }));
    expect(onSubmit).toHaveBeenCalled();
  });

  it('calls onCurrentPasswordChange on input', async () => {
    const user = userEvent.setup();
    const onCurrentPasswordChange = vi.fn();
    render(<PasswordForm {...base} onCurrentPasswordChange={onCurrentPasswordChange} />);
    await user.type(screen.getByLabelText('Current Password'), 'a');
    expect(onCurrentPasswordChange).toHaveBeenCalled();
  });

  it('calls onNewPasswordChange on input', async () => {
    const user = userEvent.setup();
    const onNewPasswordChange = vi.fn();
    render(<PasswordForm {...base} onNewPasswordChange={onNewPasswordChange} />);
    await user.type(screen.getByLabelText('New Password'), 'b');
    expect(onNewPasswordChange).toHaveBeenCalled();
  });

  it('calls onConfirmPasswordChange on input', async () => {
    const user = userEvent.setup();
    const onConfirmPasswordChange = vi.fn();
    render(<PasswordForm {...base} onConfirmPasswordChange={onConfirmPasswordChange} />);
    await user.type(screen.getByLabelText('Confirm Password'), 'c');
    expect(onConfirmPasswordChange).toHaveBeenCalled();
  });
});
