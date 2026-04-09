import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CreateStoreModal } from '@/presentation/pages/stores/CreateStoreModal';

describe('CreateStoreModal', () => {
  const base = { isOpen: true, onClose: vi.fn(), onSubmit: vi.fn().mockResolvedValue(undefined) };

  it('renders title', () => {
    render(<CreateStoreModal {...base} />);
    expect(screen.getByText('New Store')).toBeInTheDocument();
  });

  it('renders name and slug inputs', () => {
    render(<CreateStoreModal {...base} />);
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Slug')).toBeInTheDocument();
  });

  it('renders Create and Cancel buttons', () => {
    render(<CreateStoreModal {...base} />);
    expect(screen.getByText('Create')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('calls onSubmit with name and slug', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<CreateStoreModal {...base} onSubmit={onSubmit} />);
    await user.type(screen.getByLabelText('Name'), 'Test Store');
    await user.type(screen.getByLabelText('Slug'), 'test-store');
    await user.click(screen.getByRole('button', { name: 'Create' }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith('Test Store', 'test-store'));
  });

  it('calls onClose on Cancel', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<CreateStoreModal {...base} onClose={onClose} />);
    await user.click(screen.getByText('Cancel'));
    expect(onClose).toHaveBeenCalled();
  });
});
