import { render, screen } from '@testing-library/react';
import { TransactionsTable } from '@/presentation/pages/transactions/TransactionsTable';
import type { DiscountApplicationLogResponse } from '@/domain/types';

vi.mock('date-fns', () => ({ format: () => '2024-01-15' }));

const log: DiscountApplicationLogResponse = {
  id: 'log1',
  externalOrderId: 'ORD-1',
  ecommerceId: 'ec1',
  originalAmount: 50,
  discountApplied: 5,
  finalAmount: 45,
  createdAt: '2024-01-15T10:00:00Z',
  appliedRulesDetails: [{ ruleName: 'R1' }],
} as DiscountApplicationLogResponse;

describe('TransactionsTable', () => {
  it('renders table headers', () => {
    render(<TransactionsTable logs={[log]} />);
    expect(screen.getByText('Transaction ID')).toBeInTheDocument();
    expect(screen.getByText('Store & Rule')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('renders empty state when no logs', () => {
    render(<TransactionsTable logs={[]} />);
    expect(screen.getByText('No transactions found.')).toBeInTheDocument();
  });

  it('renders log rows', () => {
    render(<TransactionsTable logs={[log]} />);
    expect(screen.getByText(/TRX-ORD-1/)).toBeInTheDocument();
  });
});
