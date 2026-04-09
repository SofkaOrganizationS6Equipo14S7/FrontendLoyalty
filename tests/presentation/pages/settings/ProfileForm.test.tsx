import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProfileForm } from '@/presentation/pages/settings/ProfileForm';

describe('ProfileForm', () => {
  const base = {
    name: 'John',
    email: 'john@test.com',
    saving: false,
    onEmailChange: vi.fn(),
    onSubmit: vi.fn((e: any) => e.preventDefault()),
  };

  it('renders name and email fields', () => {
    render(<ProfileForm {...base} />);
    expect(screen.getByDisplayValue('John')).toBeInTheDocument();
    expect(screen.getByDisplayValue('john@test.com')).toBeInTheDocument();
  });

  it('renders card title', () => {
    render(<ProfileForm {...base} />);
    expect(screen.getByText('Personal Information')).toBeInTheDocument();
  });

  it('renders Save Changes button', () => {
    render(<ProfileForm {...base} />);
    expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
  });

  it('renders disabled username field', () => {
    render(<ProfileForm {...base} />);
    expect(screen.getByDisplayValue('John')).toBeDisabled();
  });

  it('calls onSubmit on form submit', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((e: any) => e.preventDefault());
    render(<ProfileForm {...base} onSubmit={onSubmit} />);
    await user.click(screen.getByRole('button', { name: /save changes/i }));
    expect(onSubmit).toHaveBeenCalled();
  });

  it('calls onEmailChange when email changes', async () => {
    const user = userEvent.setup();
    const onEmailChange = vi.fn();
    render(<ProfileForm {...base} onEmailChange={onEmailChange} />);
    await user.type(screen.getByDisplayValue('john@test.com'), 'x');
    expect(onEmailChange).toHaveBeenCalled();
  });
});
