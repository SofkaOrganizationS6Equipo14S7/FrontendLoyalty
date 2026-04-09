import { renderHook, act, waitFor } from '@testing-library/react';
import { useStores } from '@/presentation/pages/stores/useStores';

const mockEcommercesService = vi.hoisted(() => ({
  list: vi.fn().mockResolvedValue({ content: [{ uid: 'e1', name: 'Store1', status: 'ACTIVE' }], totalPages: 1, totalElements: 1 }),
  create: vi.fn().mockResolvedValue({}),
  updateStatus: vi.fn().mockResolvedValue({}),
  listApiKeys: vi.fn().mockResolvedValue([{ keyId: 'k1', prefix: 'abc' }]),
  createApiKey: vi.fn().mockResolvedValue({ keyId: 'k2', rawKey: 'raw-key' }),
  deleteApiKey: vi.fn().mockResolvedValue({}),
}));

vi.mock('@/infrastructure/api', () => ({
  ecommercesService: mockEcommercesService,
}));

vi.mock('@/lib/utils', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/utils')>();
  return { ...actual, getApiErrorMessage: vi.fn((_, msg) => msg) };
});

vi.mock('react-hot-toast', () => ({ default: { success: vi.fn(), error: vi.fn() } }));

describe('useStores', () => {
  beforeEach(() => vi.clearAllMocks());

  it('loads ecommerces on mount', async () => {
    const { result } = renderHook(() => useStores());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.ecommerces).toHaveLength(1);
    expect(result.current.totalPages).toBe(1);
  });

  it('handleCreate creates store and reloads', async () => {
    const { result } = renderHook(() => useStores());
    await waitFor(() => expect(result.current.loading).toBe(false));
    await act(async () => { await result.current.handleCreate('New Store', 'new-store'); });
    expect(mockEcommercesService.create).toHaveBeenCalledWith({ name: 'New Store', slug: 'new-store' });
  });

  it('handleToggleStatus toggles status', async () => {
    const { result } = renderHook(() => useStores());
    await waitFor(() => expect(result.current.loading).toBe(false));
    await act(async () => {
      await result.current.handleToggleStatus({ uid: 'e1', status: 'ACTIVE' } as any);
    });
    expect(mockEcommercesService.updateStatus).toHaveBeenCalledWith('e1', { status: 'INACTIVE' });
  });

  it('openDetail loads api keys', async () => {
    const { result } = renderHook(() => useStores());
    await waitFor(() => expect(result.current.loading).toBe(false));
    await act(async () => {
      await result.current.openDetail({ uid: 'e1', name: 'Store1' } as any);
    });
    expect(result.current.detailEcommerce).toBeTruthy();
    expect(mockEcommercesService.listApiKeys).toHaveBeenCalledWith('e1');
  });

  it('handleCreateKey creates key', async () => {
    const { result } = renderHook(() => useStores());
    await waitFor(() => expect(result.current.loading).toBe(false));
    await act(async () => {
      await result.current.openDetail({ uid: 'e1', name: 'S' } as any);
    });
    await act(async () => { await result.current.handleCreateKey(); });
    expect(mockEcommercesService.createApiKey).toHaveBeenCalledWith('e1');
  });

  it('handleDeleteKey removes key', async () => {
    const { result } = renderHook(() => useStores());
    await waitFor(() => expect(result.current.loading).toBe(false));
    await act(async () => {
      await result.current.openDetail({ uid: 'e1', name: 'S' } as any);
    });
    await act(async () => { await result.current.handleDeleteKey('k1'); });
    expect(mockEcommercesService.deleteApiKey).toHaveBeenCalledWith('e1', 'k1');
  });

  it('handleCreateKey does nothing without detail', async () => {
    const { result } = renderHook(() => useStores());
    await waitFor(() => expect(result.current.loading).toBe(false));
    await act(async () => { await result.current.handleCreateKey(); });
    expect(mockEcommercesService.createApiKey).not.toHaveBeenCalled();
  });

  it('exposes PAGE_SIZE', () => {
    const { result } = renderHook(() => useStores());
    expect(result.current.PAGE_SIZE).toBe(10);
  });
});
