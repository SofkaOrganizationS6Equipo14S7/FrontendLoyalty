import { render, screen } from '@testing-library/react';

vi.mock('date-fns', () => ({ format: () => '2024-01-15' }));

const mockUseTransactions = vi.hoisted(() => vi.fn());
vi.mock('@/presentation/pages/transactions/useTransactions', () => ({
  useTransactions: mockUseTransactions,
}));

import { TransactionsPage } from '@/presentation/pages/transactions';

describe('TransactionsPage', () => {
  const baseState = {
    logs: [],
    loading: false,
    searchQuery: '',
    setSearchQuery: vi.fn(),
    page: 0,
    setPage: vi.fn(),
    totalPages: 0,
    totalElements: 0,
    PAGE_SIZE: 10,
    handleSearch: vi.fn(),
    handleExportCSV: vi.fn(),
  };

  it('renders page header', () => {
    mockUseTransactions.mockReturnValue(baseState);
    render(<TransactionsPage />);
    expect(screen.getByText('Transaction History')).toBeInTheDocument();
  });

  it('renders Export CSV button', () => {
    mockUseTransactions.mockReturnValue(baseState);
    render(<TransactionsPage />);
    expect(screen.getByText('Export CSV')).toBeInTheDocument();
  });

  it('renders loading state', () => {
    mockUseTransactions.mockReturnValue({ ...baseState, loading: true });
    const { container } = render(<TransactionsPage />);
    expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0);
  });

  it('renders empty table when no logs', () => {
    mockUseTransactions.mockReturnValue(baseState);
    render(<TransactionsPage />);
    expect(screen.getByText('No transactions found.')).toBeInTheDocument();
  });
});
