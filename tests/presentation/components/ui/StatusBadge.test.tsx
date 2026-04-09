import { render, screen } from '@testing-library/react';
import { StatusBadge } from '@/presentation/components/ui/StatusBadge';

describe('StatusBadge', () => {
  it('renders "Active" when active is true', () => {
    render(<StatusBadge active={true} />);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('renders "Inactive" when active is false', () => {
    render(<StatusBadge active={false} />);
    expect(screen.getByText('Inactive')).toBeInTheDocument();
  });

  it('uses custom activeLabel', () => {
    render(<StatusBadge active={true} activeLabel="Enabled" />);
    expect(screen.getByText('Enabled')).toBeInTheDocument();
  });

  it('uses custom inactiveLabel', () => {
    render(<StatusBadge active={false} inactiveLabel="Disabled" />);
    expect(screen.getByText('Disabled')).toBeInTheDocument();
  });

  it('uses success variant when active', () => {
    const { container } = render(<StatusBadge active={true} />);
    expect(container.firstChild).toHaveClass('bg-emerald-500/15');
  });

  it('uses secondary variant when inactive', () => {
    const { container } = render(<StatusBadge active={false} />);
    expect(container.firstChild).toHaveClass('bg-slate-100');
  });
});
