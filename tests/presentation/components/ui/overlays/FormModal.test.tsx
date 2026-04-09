import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormModal } from '@/presentation/components/ui/overlays/FormModal';

describe('FormModal', () => {
  const base = { isOpen: true, onClose: vi.fn(), title: 'Form', onSubmit: vi.fn() };

  it('renders title and children', () => {
    render(<FormModal {...base}><div>Form content</div></FormModal>);
    expect(screen.getByText('Form')).toBeInTheDocument();
    expect(screen.getByText('Form content')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(<FormModal {...base} description="Fill it out"><div>C</div></FormModal>);
    expect(screen.getByText('Fill it out')).toBeInTheDocument();
  });

  it('renders default submit label', () => {
    render(<FormModal {...base}><div>C</div></FormModal>);
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('renders custom submit label', () => {
    render(<FormModal {...base} submitLabel="Create"><div>C</div></FormModal>);
    expect(screen.getByText('Create')).toBeInTheDocument();
  });

  it('calls onSubmit when submit button clicked', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<FormModal {...base} onSubmit={onSubmit}><div>C</div></FormModal>);
    await user.click(screen.getByText('Save'));
    expect(onSubmit).toHaveBeenCalled();
  });

  it('calls onClose when Cancel clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<FormModal {...base} onClose={onClose}><div>C</div></FormModal>);
    await user.click(screen.getByText('Cancel'));
    expect(onClose).toHaveBeenCalled();
  });

  it('disables submit when submitDisabled is true', () => {
    render(<FormModal {...base} submitDisabled><div>C</div></FormModal>);
    expect(screen.getByText('Save')).toBeDisabled();
  });

  it('does not render when closed', () => {
    render(<FormModal {...base} isOpen={false}><div>C</div></FormModal>);
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
