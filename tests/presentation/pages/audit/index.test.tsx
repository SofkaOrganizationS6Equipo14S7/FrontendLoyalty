import { render, screen } from '@testing-library/react';

const mockUseAudit = vi.hoisted(() => vi.fn());
vi.mock('@/presentation/pages/audit/useAudit', () => ({
  useAudit: mockUseAudit,
}));

import { AuditPage } from '@/presentation/pages/audit';

describe('AuditPage', () => {
  const baseState = {
    logs: [],
    loading: false,
    ecommerces: [],
    users: new Map(),
    page: 0,
    setPage: vi.fn(),
    totalPages: 0,
    totalElements: 0,
    PAGE_SIZE: 10,
    filterEcommerce: '',
    filterEntity: '',
    handleEcommerceChange: vi.fn(),
    handleEntityChange: vi.fn(),
  };

  it('renders page header', () => {
    mockUseAudit.mockReturnValue(baseState);
    render(<AuditPage />);
    expect(screen.getByText('Audit Log')).toBeInTheDocument();
  });

  it('renders loading state', () => {
    mockUseAudit.mockReturnValue({ ...baseState, loading: true });
    const { container } = render(<AuditPage />);
    expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0);
  });

  it('renders empty state', () => {
    mockUseAudit.mockReturnValue(baseState);
    render(<AuditPage />);
    expect(screen.getByText('No audit logs found')).toBeInTheDocument();
  });
});
