import { renderHook, act, waitFor } from '@testing-library/react';
import { useRolesPermissions } from '@/presentation/pages/roles/useRolesPermissions';

const mockRolesService = vi.hoisted(() => ({
  list: vi.fn().mockResolvedValue([{ id: 'r1', name: 'ADMIN' }, { id: 'r2', name: 'USER' }]),
  getPermissions: vi.fn().mockResolvedValue([
    { id: 'p1', name: 'READ', module: 'USERS' },
    { id: 'p2', name: 'WRITE', module: 'USERS' },
    { id: 'p3', name: 'READ', module: 'STORES' },
  ]),
  getById: vi.fn().mockResolvedValue({ id: 'r1', name: 'ADMIN', permissions: [{ id: 'p1' }] }),
  assignPermissions: vi.fn().mockResolvedValue({}),
}));

vi.mock('@/infrastructure/api', () => ({
  rolesService: mockRolesService,
}));

vi.mock('react-hot-toast', () => ({ default: { success: vi.fn(), error: vi.fn() } }));

describe('useRolesPermissions', () => {
  beforeEach(() => vi.clearAllMocks());

  it('loads roles and permissions on mount', async () => {
    const { result } = renderHook(() => useRolesPermissions());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.roles).toHaveLength(2);
    expect(result.current.allPermissions).toHaveLength(3);
  });

  it('computes modules from permissions', async () => {
    const { result } = renderHook(() => useRolesPermissions());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.modules).toEqual(['STORES', 'USERS']);
  });

  it('openAssign loads role details and sets permissions', async () => {
    const { result } = renderHook(() => useRolesPermissions());
    await waitFor(() => expect(result.current.loading).toBe(false));
    await act(async () => { await result.current.openAssign({ id: 'r1' } as any); });
    expect(result.current.showAssign).toBe(true);
    expect(result.current.selectedRole).toBeTruthy();
    expect(result.current.selectedPermIds).toContain('p1');
  });

  it('togglePermission adds and removes permissions', async () => {
    const { result } = renderHook(() => useRolesPermissions());
    await waitFor(() => expect(result.current.loading).toBe(false));
    await act(async () => { await result.current.openAssign({ id: 'r1' } as any); });
    // Add p2
    act(() => result.current.togglePermission('p2'));
    expect(result.current.selectedPermIds).toContain('p2');
    // Remove p2
    act(() => result.current.togglePermission('p2'));
    expect(result.current.selectedPermIds).not.toContain('p2');
  });

  it('handleSavePermissions saves and reloads', async () => {
    const { result } = renderHook(() => useRolesPermissions());
    await waitFor(() => expect(result.current.loading).toBe(false));
    await act(async () => { await result.current.openAssign({ id: 'r1' } as any); });
    await act(async () => { await result.current.handleSavePermissions(); });
    expect(mockRolesService.assignPermissions).toHaveBeenCalledWith('r1', expect.any(Array));
    expect(result.current.showAssign).toBe(false);
  });

  it('handleSavePermissions does nothing without selectedRole', async () => {
    const { result } = renderHook(() => useRolesPermissions());
    await waitFor(() => expect(result.current.loading).toBe(false));
    await act(async () => { await result.current.handleSavePermissions(); });
    expect(mockRolesService.assignPermissions).not.toHaveBeenCalled();
  });
});
