import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TransactionsToolbar } from '@/presentation/pages/transactions/TransactionsToolbar';

describe('TransactionsToolbar', () => {
  const base = { searchQuery: '', onSearchChange: vi.fn(), onSearch: vi.fn(), totalElements: 42 };

  it('renders search input', () => {
    render(<TransactionsToolbar {...base} />);
    expect(screen.getByPlaceholderText('Search by Order ID...')).toBeInTheDocument();
  });

  it('renders total elements', () => {
    render(<TransactionsToolbar {...base} />);
    expect(screen.getByText('42 entries')).toBeInTheDocument();
  });

  it('calls onSearchChange when typing', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TransactionsToolbar {...base} onSearchChange={onChange} />);
    await user.type(screen.getByPlaceholderText('Search by Order ID...'), 'x');
    expect(onChange).toHaveBeenCalled();
  });
});
