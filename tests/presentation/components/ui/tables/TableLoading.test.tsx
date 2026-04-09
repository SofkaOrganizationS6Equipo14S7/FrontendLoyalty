import { render } from '@testing-library/react';
import { TableLoading } from '@/presentation/components/ui/tables/TableLoading';

describe('TableLoading', () => {
  it('renders default 5 skeleton rows', () => {
    const { container } = render(<TableLoading />);
    const rows = container.querySelectorAll('.h-12');
    expect(rows.length).toBe(5);
  });

  it('renders custom number of rows', () => {
    const { container } = render(<TableLoading rows={3} />);
    const wrapper = container.querySelector('.animate-pulse')!;
    expect(wrapper.children.length).toBe(3);
  });

  it('applies custom row height', () => {
    const { container } = render(<TableLoading rowHeight="h-8" rows={2} />);
    const rows = container.querySelectorAll('.h-8');
    expect(rows.length).toBe(2);
  });

  it('has animate-pulse class', () => {
    const { container } = render(<TableLoading />);
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });
});
