import { render, screen } from '@testing-library/react';
import { TransactionRow } from '@/presentation/pages/transactions/TransactionRow';
import type { DiscountApplicationLogResponse } from '@/domain/types';

vi.mock('date-fns', () => ({ format: (_d: Date, _f: string) => '2024-01-15' }));

const base: DiscountApplicationLogResponse = {
  id: 'abc12345-xxxx',
  externalOrderId: 'ORD-001',
  ecommerceId: 'store-123',
  originalAmount: 100,
  discountApplied: 10,
  finalAmount: 90,
  createdAt: '2024-01-15T10:00:00Z',
  appliedRulesDetails: [{ ruleName: 'Rule1' }],
} as DiscountApplicationLogResponse;

function renderRow(log = base) {
  return render(
    <table><tbody><TransactionRow log={log} /></tbody></table>,
  );
}

describe('TransactionRow', () => {
  it('renders transaction ID', () => {
    renderRow();
    expect(screen.getByText(/TRX-ORD-001/)).toBeInTheDocument();
  });

  it('renders store and rule name', () => {
    renderRow();
    expect(screen.getByText('store-123')).toBeInTheDocument();
    expect(screen.getByText('Rule1')).toBeInTheDocument();
  });

  it('renders amounts', () => {
    renderRow();
    expect(screen.getByText('$100.00')).toBeInTheDocument();
    expect(screen.getByText('-$10.00')).toBeInTheDocument();
  });

  it('renders Completed badge', () => {
    renderRow();
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('shows Capped when discount < original - final', () => {
    const log = { ...base, discountApplied: 5, finalAmount: 90 };
    renderRow(log);
    expect(screen.getByText('Capped')).toBeInTheDocument();
  });

  it('falls back to id slice when no externalOrderId', () => {
    renderRow({ ...base, externalOrderId: '' });
    expect(screen.getByText('TRX-abc1')).toBeInTheDocument();
  });

  it('falls back to Direct when no rule', () => {
    renderRow({ ...base, appliedRulesDetails: [] });
    expect(screen.getByText('Direct')).toBeInTheDocument();
  });
});
