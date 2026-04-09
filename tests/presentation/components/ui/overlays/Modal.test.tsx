import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal, ConfirmModal } from '@/presentation/components/ui/overlays/Modal';

describe('Modal', () => {
  it('does not render when closed', () => {
    render(<Modal isOpen={false} onClose={() => {}} title="Test">Content</Modal>);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('renders when open', () => {
    render(<Modal isOpen={true} onClose={() => {}} title="Test Title">Content</Modal>);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(<Modal isOpen={true} onClose={() => {}} title="T" description="A description">C</Modal>);
    expect(screen.getByText('A description')).toBeInTheDocument();
  });

  it('does not render description when not provided', () => {
    render(<Modal isOpen={true} onClose={() => {}} title="T">C</Modal>);
    expect(screen.queryByText('A description')).toBeNull();
  });

  it('calls onClose when close button clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Modal isOpen={true} onClose={onClose} title="T">C</Modal>);
    await user.click(screen.getByLabelText('Close'));
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose on Escape key', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Modal isOpen={true} onClose={onClose} title="T">C</Modal>);
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose on backdrop click', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Modal isOpen={true} onClose={onClose} title="T">C</Modal>);
    const backdrop = document.querySelector('[aria-hidden="true"]')!;
    await user.click(backdrop);
    expect(onClose).toHaveBeenCalled();
  });

  it('sets body overflow hidden when open', () => {
    render(<Modal isOpen={true} onClose={() => {}} title="T">C</Modal>);
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('restores body overflow on unmount', () => {
    const { unmount } = render(<Modal isOpen={true} onClose={() => {}} title="T">C</Modal>);
    unmount();
    expect(document.body.style.overflow).toBe('');
  });

  it('applies size sm', () => {
    render(<Modal isOpen={true} onClose={() => {}} title="T" size="sm">C</Modal>);
    expect(screen.getByRole('dialog').className).toContain('max-w-md');
  });

  it('applies size md by default', () => {
    render(<Modal isOpen={true} onClose={() => {}} title="T">C</Modal>);
    expect(screen.getByRole('dialog').className).toContain('max-w-lg');
  });

  it('applies size lg', () => {
    render(<Modal isOpen={true} onClose={() => {}} title="T" size="lg">C</Modal>);
    expect(screen.getByRole('dialog').className).toContain('max-w-2xl');
  });

  it('applies custom className', () => {
    render(<Modal isOpen={true} onClose={() => {}} title="T" className="extra">C</Modal>);
    expect(screen.getByRole('dialog').className).toContain('extra');
  });
});

describe('ConfirmModal', () => {
  const base = { isOpen: true, onClose: vi.fn(), onConfirm: vi.fn(), title: 'Confirm', message: 'Are you sure?' };

  it('renders title and message', () => {
    render(<ConfirmModal {...base} />);
    expect(screen.getByText('Confirm')).toBeInTheDocument();
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
  });

  it('renders default confirm label', () => {
    render(<ConfirmModal {...base} />);
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('renders custom confirm label', () => {
    render(<ConfirmModal {...base} confirmLabel="Remove" />);
    expect(screen.getByText('Remove')).toBeInTheDocument();
  });

  it('calls onConfirm when confirm clicked', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(<ConfirmModal {...base} onConfirm={onConfirm} />);
    await user.click(screen.getByText('Delete'));
    expect(onConfirm).toHaveBeenCalled();
  });

  it('calls onClose when Cancel clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<ConfirmModal {...base} onClose={onClose} />);
    await user.click(screen.getByText('Cancel'));
    expect(onClose).toHaveBeenCalled();
  });

  it('disables Cancel when loading', () => {
    render(<ConfirmModal {...base} isLoading={true} />);
    expect(screen.getByText('Cancel')).toBeDisabled();
  });
});
