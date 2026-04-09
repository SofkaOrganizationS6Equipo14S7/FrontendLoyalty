import { renderHook, waitFor } from '@testing-library/react';
import { useDashboardData } from '@/presentation/pages/dashboard/useDashboardData';

vi.mock('@/infrastructure/api', () => ({
  discountLogsService: {
    list: vi.fn().mockResolvedValue({
      content: [
        { orderAmount: 100, discountApplied: 10, createdAt: '2024-01-15T10:00:00Z', ecommerceId: 'e1', ruleName: 'Rule1' },
        { orderAmount: 200, discountApplied: 20, createdAt: '2024-02-15T10:00:00Z', ecommerceId: 'e1', ruleName: 'Rule2' },
      ],
    }),
  },
  rulesService: {
    list: vi.fn().mockResolvedValue({ content: [{ id: 'r1', isActive: true }, { id: 'r2', isActive: false }] }),
  },
  ecommercesService: {
    list: vi.fn().mockResolvedValue({ content: [{ id: 'e1', name: 'Store1', status: 'ACTIVE' }] }),
  },
  usersService: {
    list: vi.fn().mockResolvedValue({ content: [{ uid: 'u1' }, { uid: 'u2' }] }),
  },
}));

vi.mock('@/lib/utils', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/utils')>();
  return { ...actual, getTimeAgo: vi.fn().mockReturnValue('2 hours ago') };
});

describe('useDashboardData', () => {
  beforeEach(() => vi.clearAllMocks());

  it('loads metrics', async () => {
    const { result } = renderHook(() => useDashboardData());
    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.metrics).toEqual({
      totalRevenue: 300,
      activeDiscounts: 1,
      totalUsers: 2,
      activeStores: 1,
    });
  });

  it('generates chart data with 12 months', async () => {
    const { result } = renderHook(() => useDashboardData());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.chartData).toHaveLength(12);
    expect(result.current.chartData[0].name).toBe('Jan');
  });

  it('generates activity from logs', async () => {
    const { result } = renderHook(() => useDashboardData());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.activity.length).toBeGreaterThan(0);
    expect(result.current.activity[0].store).toBe('Store1');
  });
});
