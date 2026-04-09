import { renderHook, act, waitFor } from '@testing-library/react';
import { useUsers } from '@/presentation/pages/users/useUsers';

const mockUsersService = vi.hoisted(() => ({
  list: vi.fn().mockResolvedValue({ content: [{ uid: 'u1', username: 'admin', email: 'a@b.com', roleId: 'r1', isActive: true }], totalPages: 1, totalElements: 1 }),
  create: vi.fn().mockResolvedValue({}),
  update: vi.fn().mockResolvedValue({}),
  delete: vi.fn().mockResolvedValue({}),
}));

const mockEcommercesService = vi.hoisted(() => ({
  list: vi.fn().mockResolvedValue({ content: [{ uid: 'e1', name: 'Store' }] }),
}));

const mockRolesService = vi.hoisted(() => ({
  list: vi.fn().mockResolvedValue([{ id: 'r1', name: 'ADMIN' }]),
}));

vi.mock('@/infrastructure/api', () => ({
  usersService: mockUsersService,
  ecommercesService: mockEcommercesService,
  rolesService: mockRolesService,
}));

vi.mock('@/lib/utils', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/utils')>();
  return actual;
});

vi.mock('react-hot-toast', () => ({ default: { success: vi.fn(), error: vi.fn() } }));

describe('useUsers', () => {
  beforeEach(() => vi.clearAllMocks());

  it('loads users, ecommerces, roles on mount', async () => {
    const { result } = renderHook(() => useUsers());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.filtered).toHaveLength(1);
    expect(result.current.ecommerces).toHaveLength(1);
    expect(result.current.roles).toHaveLength(1);
  });

  it('filters users by search', async () => {
    const { result } = renderHook(() => useUsers());
    await waitFor(() => expect(result.current.loading).toBe(false));
    act(() => result.current.setSearch('admin'));
    expect(result.current.filtered).toHaveLength(1);
    act(() => result.current.setSearch('nonexistent'));
    expect(result.current.filtered).toHaveLength(0);
  });

  it('openCreate opens modal with empty form', async () => {
    const { result } = renderHook(() => useUsers());
    await waitFor(() => expect(result.current.loading).toBe(false));
    act(() => result.current.openCreate());
    expect(result.current.showModal).toBe(true);
    expect(result.current.editingUser).toBeNull();
  });

  it('openEdit populates form', async () => {
    const { result } = renderHook(() => useUsers());
    await waitFor(() => expect(result.current.loading).toBe(false));
    act(() => result.current.openEdit({ uid: 'u1', username: 'admin', email: 'a@b.com', roleId: 'r1' } as any));
    expect(result.current.showModal).toBe(true);
    expect(result.current.form.username).toBe('admin');
  });

  it('handleSave creates a new user', async () => {
    const { result } = renderHook(() => useUsers());
    await waitFor(() => expect(result.current.loading).toBe(false));
    act(() => result.current.openCreate());
    act(() => result.current.setForm({ username: 'new', email: 'n@b.com', password: 'pass', roleId: 'r1', ecommerceId: '' }));
    await act(async () => { await result.current.handleSave(); });
    expect(mockUsersService.create).toHaveBeenCalled();
  });

  it('handleSave updates an existing user', async () => {
    const { result } = renderHook(() => useUsers());
    await waitFor(() => expect(result.current.loading).toBe(false));
    act(() => result.current.openEdit({ uid: 'u1', username: 'admin', email: 'a@b.com', roleId: 'r1' } as any));
    await act(async () => { await result.current.handleSave(); });
    expect(mockUsersService.update).toHaveBeenCalledWith('u1', expect.any(Object));
  });

  it('handleDelete deletes user', async () => {
    const { result } = renderHook(() => useUsers());
    await waitFor(() => expect(result.current.loading).toBe(false));
    act(() => result.current.setDeleteTarget({ uid: 'u1' } as any));
    await act(async () => { await result.current.handleDelete(); });
    expect(mockUsersService.delete).toHaveBeenCalledWith('u1');
  });

  it('handleToggleActive toggles user', async () => {
    const { result } = renderHook(() => useUsers());
    await waitFor(() => expect(result.current.loading).toBe(false));
    await act(async () => {
      await result.current.handleToggleActive({ uid: 'u1', isActive: true } as any);
    });
    expect(mockUsersService.update).toHaveBeenCalledWith('u1', { active: false });
  });

  it('exposes PAGE_SIZE', () => {
    const { result } = renderHook(() => useUsers());
    expect(result.current.PAGE_SIZE).toBe(5);
  });
});
