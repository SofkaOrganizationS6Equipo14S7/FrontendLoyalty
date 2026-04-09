import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PaginationFooter } from '@/presentation/components/ui/navigation/PaginationFooter';

describe('PaginationFooter', () => {
  const base = { pageSize: 10, totalElements: 50, onPageChange: vi.fn() };

  it('returns null when totalPages <= 1', () => {
    const { container } = render(
      <PaginationFooter page={0} totalPages={1} {...base} />
    );
    expect(container.innerHTML).toBe('');
  });

  it('renders showing X to Y of Z text', () => {
    render(<PaginationFooter page={0} totalPages={5} {...base} />);
    expect(screen.getByText(/Showing/)).toBeInTheDocument();
    expect(screen.getByText(/of/)).toBeInTheDocument();
  });

  it('renders correct range for middle pages', () => {
    render(<PaginationFooter page={2} totalPages={5} {...base} />);
    expect(screen.getByText(/Showing/)).toHaveTextContent('Showing 21 to 30 of 50 results');
  });

  it('clamps end to totalElements on last page', () => {
    render(<PaginationFooter page={4} totalPages={5} pageSize={10} totalElements={45} onPageChange={vi.fn()} />);
    expect(screen.getByText(/Showing/)).toHaveTextContent('Showing 41 to 45 of 45 results');
  });

  it('disables previous button on first page', () => {
    render(<PaginationFooter page={0} totalPages={5} {...base} />);
    expect(screen.getByLabelText('Previous page')).toBeDisabled();
  });

  it('disables next button on last page', () => {
    render(<PaginationFooter page={4} totalPages={5} {...base} />);
    expect(screen.getByLabelText('Next page')).toBeDisabled();
  });

  it('calls onPageChange on previous click', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<PaginationFooter page={2} totalPages={5} {...base} onPageChange={onChange} />);
    await user.click(screen.getByLabelText('Previous page'));
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it('calls onPageChange on next click', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<PaginationFooter page={2} totalPages={5} {...base} onPageChange={onChange} />);
    await user.click(screen.getByLabelText('Next page'));
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it('renders page number buttons', () => {
    render(<PaginationFooter page={0} totalPages={3} {...base} />);
    const nav = screen.getByRole('navigation');
    const buttons = nav.querySelectorAll('button:not([aria-label])');
    expect(buttons.length).toBe(3);
  });

  it('highlights current page', () => {
    render(<PaginationFooter page={1} totalPages={3} {...base} />);
    const activeBtn = screen.getByText('2');
    expect(activeBtn).toHaveAttribute('aria-current', 'page');
  });

  it('calls onPageChange when clicking a page number', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<PaginationFooter page={0} totalPages={3} {...base} onPageChange={onChange} />);
    await user.click(screen.getByText('3'));
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it('renders ellipsis for many pages', () => {
    render(<PaginationFooter page={5} totalPages={20} pageSize={10} totalElements={200} onPageChange={vi.fn()} />);
    const ellipses = screen.getAllByText('…');
    expect(ellipses.length).toBeGreaterThanOrEqual(1);
  });
});
