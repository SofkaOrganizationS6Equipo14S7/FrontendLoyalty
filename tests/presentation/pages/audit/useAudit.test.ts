import { renderHook, waitFor } from '@testing-library/react';
import { useAudit } from '@/presentation/pages/audit/useAudit';

vi.mock('@/infrastructure/api', () => ({
  auditService: {
    list: vi.fn().mockResolvedValue({ content: [{ id: '1', action: 'CREATE' }], totalPages: 2, totalElements: 25 }),
  },
  ecommercesService: {
    list: vi.fn().mockResolvedValue({ content: [{ id: 'e1', name: 'Store1' }] }),
  },
  usersService: {
    list: vi.fn().mockResolvedValue({ content: [{ uid: 'u1', username: 'admin' }] }),
  },
}));

describe('useAudit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads logs on mount', async () => {
    const { result } = renderHook(() => useAudit());
    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.logs).toEqual([{ id: '1', action: 'CREATE' }]);
    expect(result.current.totalPages).toBe(2);
    expect(result.current.totalElements).toBe(25);
  });

  it('loads ecommerces', async () => {
    const { result } = renderHook(() => useAudit());
    await waitFor(() => expect(result.current.ecommerces.length).toBe(1));
    expect(result.current.ecommerces[0].name).toBe('Store1');
  });

  it('loads users map', async () => {
    const { result } = renderHook(() => useAudit());
    await waitFor(() => expect(result.current.users.size).toBe(1));
    expect(result.current.users.get('u1')).toBe('admin');
  });

  it('provides filter handlers', async () => {
    const { result } = renderHook(() => useAudit());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(typeof result.current.handleEcommerceChange).toBe('function');
    expect(typeof result.current.handleEntityChange).toBe('function');
  });

  it('exposes PAGE_SIZE', () => {
    const { result } = renderHook(() => useAudit());
    expect(result.current.PAGE_SIZE).toBe(20);
  });

  it('handleEcommerceChange updates filter and resets page', async () => {
    const { result } = renderHook(() => useAudit());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const { act } = await import('@testing-library/react');
    act(() => result.current.handleEcommerceChange('e1'));
    expect(result.current.filterEcommerce).toBe('e1');
    expect(result.current.page).toBe(0);
  });

  it('handleEntityChange updates filter and resets page', async () => {
    const { result } = renderHook(() => useAudit());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const { act } = await import('@testing-library/react');
    act(() => result.current.handleEntityChange('rule'));
    expect(result.current.filterEntity).toBe('rule');
    expect(result.current.page).toBe(0);
  });

  it('setPage updates page', async () => {
    const { result } = renderHook(() => useAudit());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const { act } = await import('@testing-library/react');
    act(() => result.current.setPage(1));
    expect(result.current.page).toBe(1);
  });
});
