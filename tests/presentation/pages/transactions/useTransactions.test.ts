import { renderHook, act, waitFor } from '@testing-library/react';
import { useTransactions } from '@/presentation/pages/transactions/useTransactions';

const mockDiscountLogsService = vi.hoisted(() => ({
  list: vi.fn().mockResolvedValue({
    content: [{ id: 'l1', externalOrderId: 'ORD1', ecommerceId: 'e1', originalAmount: 100, discountApplied: 10, createdAt: '2024-01-15T10:00:00Z', appliedRulesDetails: [{ ruleName: 'Rule1' }] }],
    totalPages: 1,
    totalElements: 1,
  }),
}));

vi.mock('@/infrastructure/api', () => ({
  discountLogsService: mockDiscountLogsService,
}));

vi.mock('@/infrastructure/store', () => ({
  useAuthStore: vi.fn(() => ({ user: { ecommerceId: 'e1' } })),
}));

vi.mock('@/lib/utils', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/utils')>();
  return actual;
});

vi.mock('react-hot-toast', () => ({ default: { success: vi.fn(), error: vi.fn() } }));

describe('useTransactions', () => {
  beforeEach(() => vi.clearAllMocks());

  it('loads logs on mount', async () => {
    const { result } = renderHook(() => useTransactions());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.logs).toHaveLength(1);
    expect(result.current.totalPages).toBe(1);
  });

  it('provides search query state', async () => {
    const { result } = renderHook(() => useTransactions());
    await waitFor(() => expect(result.current.loading).toBe(false));
    act(() => result.current.setSearchQuery('ORD1'));
    expect(result.current.searchQuery).toBe('ORD1');
  });

  it('handleSearch resets page and reloads', async () => {
    const { result } = renderHook(() => useTransactions());
    await waitFor(() => expect(result.current.loading).toBe(false));
    await act(async () => { result.current.handleSearch(); });
    expect(mockDiscountLogsService.list).toHaveBeenCalled();
  });

  it('handleExportCSV exports data', async () => {
    const clickMock = vi.fn();
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(clickMock);
    const { result } = renderHook(() => useTransactions());
    await waitFor(() => expect(result.current.loading).toBe(false));
    await act(async () => { await result.current.handleExportCSV(); });
    expect(mockDiscountLogsService.list).toHaveBeenCalledTimes(2);
    clickMock.mockRestore();
  });

  it('handleExportCSV shows error when no data', async () => {
    mockDiscountLogsService.list.mockResolvedValueOnce({ content: [], totalPages: 0, totalElements: 0 });
    const toast = await import('react-hot-toast');
    const { result } = renderHook(() => useTransactions());
    await waitFor(() => expect(result.current.loading).toBe(false));
    await act(async () => { await result.current.handleExportCSV(); });
    expect(toast.default.error).toHaveBeenCalledWith('No data to export');
  });

  it('exposes PAGE_SIZE', () => {
    const { result } = renderHook(() => useTransactions());
    expect(result.current.PAGE_SIZE).toBe(10);
  });
});
