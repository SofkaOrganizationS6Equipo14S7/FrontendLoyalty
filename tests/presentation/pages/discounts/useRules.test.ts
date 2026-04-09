import { renderHook, act, waitFor } from '@testing-library/react';
import { useRules } from '@/presentation/pages/discounts/useRules';
import type { DiscountTypeDTO } from '@/domain/types';

const mockRulesService = vi.hoisted(() => ({
  list: vi.fn().mockResolvedValue({ content: [{ id: 'r1', name: 'Rule1', isActive: true, discountPercentage: 10, discountPriorityId: 'p1', description: '' }] }),
  getAttributes: vi.fn().mockResolvedValue([{ id: 'a1', name: 'attr1' }]),
  getDiscountPriorities: vi.fn().mockResolvedValue([{ id: 'p1', name: 'High' }]),
  create: vi.fn().mockResolvedValue({}),
  update: vi.fn().mockResolvedValue({}),
  delete: vi.fn().mockResolvedValue({}),
  getRuleTiers: vi.fn().mockResolvedValue([{ customerTierId: 't1' }]),
  addTiers: vi.fn().mockResolvedValue({}),
  removeTier: vi.fn().mockResolvedValue({}),
}));

vi.mock('@/infrastructure/api', () => ({
  rulesService: mockRulesService,
}));

vi.mock('react-hot-toast', () => ({ default: { success: vi.fn(), error: vi.fn() } }));

const discountTypes: DiscountTypeDTO[] = [
  { id: 'dt1', code: 'PRODUCT', displayName: 'Product', description: '' },
];

describe('useRules', () => {
  beforeEach(() => vi.clearAllMocks());

  it('loadRules fetches rules', async () => {
    const { result } = renderHook(() => useRules(discountTypes, 'PRODUCT'));
    await act(async () => { await result.current.loadRules(); });
    expect(result.current.rules).toHaveLength(1);
    expect(result.current.rules[0].name).toBe('Rule1');
  });

  it('openCreate loads attributes and opens form', async () => {
    const { result } = renderHook(() => useRules(discountTypes, 'PRODUCT'));
    await act(async () => { await result.current.openCreate(); });
    expect(result.current.showForm).toBe(true);
    expect(result.current.editingRule).toBeNull();
    expect(mockRulesService.getAttributes).toHaveBeenCalledWith('dt1');
  });

  it('openEdit loads attributes and populates form', async () => {
    const { result } = renderHook(() => useRules(discountTypes, 'PRODUCT'));
    const rule = { id: 'r1', name: 'Rule1', isActive: true, discountPercentage: 10, discountPriorityId: 'p1', description: 'desc' };
    await act(async () => { await result.current.openEdit(rule as any); });
    expect(result.current.showForm).toBe(true);
    expect(result.current.editingRule).toBeTruthy();
    expect(result.current.form.name).toBe('Rule1');
  });

  it('handleSave creates a new rule', async () => {
    const { result } = renderHook(() => useRules(discountTypes, 'PRODUCT'));
    await act(async () => { await result.current.openCreate(); });
    act(() => {
      result.current.setForm({ name: 'New', description: '', discountPercentage: '5', discountPriorityId: 'p1', attrs: {} });
    });
    await act(async () => { await result.current.handleSave(); });
    expect(mockRulesService.create).toHaveBeenCalled();
    expect(result.current.showForm).toBe(false);
  });

  it('handleDelete deletes a rule', async () => {
    const { result } = renderHook(() => useRules(discountTypes, 'PRODUCT'));
    act(() => { result.current.setDeleteTarget({ id: 'r1' } as any); });
    await act(async () => { await result.current.handleDelete(); });
    expect(mockRulesService.delete).toHaveBeenCalledWith('r1');
  });

  it('handleDelete does nothing without target', async () => {
    const { result } = renderHook(() => useRules(discountTypes, 'PRODUCT'));
    await act(async () => { await result.current.handleDelete(); });
    expect(mockRulesService.delete).not.toHaveBeenCalled();
  });

  it('openTierAssign loads assigned tiers', async () => {
    const { result } = renderHook(() => useRules(discountTypes, 'PRODUCT'));
    await act(async () => {
      await result.current.openTierAssign({ id: 'r1' } as any);
    });
    expect(result.current.showTierAssign).toBe(true);
    expect(mockRulesService.getRuleTiers).toHaveBeenCalledWith('r1');
  });

  it('handleToggleTier adds and removes tier ids', () => {
    const { result } = renderHook(() => useRules(discountTypes, 'PRODUCT'));
    act(() => result.current.handleToggleTier('t1', true));
    expect(result.current.selectedTierIds).toContain('t1');
    act(() => result.current.handleToggleTier('t1', false));
    expect(result.current.selectedTierIds).not.toContain('t1');
  });

  it('handleToggleActive calls update and reloads', async () => {
    const { result } = renderHook(() => useRules(discountTypes, 'PRODUCT'));
    const rule = { id: 'r1', name: 'Rule1', isActive: true, discountPercentage: 10, discountPriorityId: 'p1', description: '' };
    await act(async () => { await result.current.handleToggleActive(rule as any); });
    expect(mockRulesService.update).toHaveBeenCalledWith('r1', expect.objectContaining({ name: 'Rule1' }));
  });

  it('handleSave updates existing rule', async () => {
    const { result } = renderHook(() => useRules(discountTypes, 'PRODUCT'));
    const rule = { id: 'r1', name: 'Rule1', isActive: true, discountPercentage: 10, discountPriorityId: 'p1', description: 'desc' };
    await act(async () => { await result.current.openEdit(rule as any); });
    await act(async () => { await result.current.handleSave(); });
    expect(mockRulesService.update).toHaveBeenCalledWith('r1', expect.any(Object));
  });

  it('handleAssignTiers adds and removes tiers', async () => {
    const { result } = renderHook(() => useRules(discountTypes, 'PRODUCT'));
    await act(async () => { await result.current.openTierAssign({ id: 'r1' } as any); });
    // Add a new tier
    act(() => result.current.handleToggleTier('t2', true));
    await act(async () => { await result.current.handleAssignTiers(); });
    expect(mockRulesService.addTiers).toHaveBeenCalled();
  });

  it('handleSave error shows toast', async () => {
    mockRulesService.create.mockRejectedValueOnce(new Error('fail'));
    const { result } = renderHook(() => useRules(discountTypes, 'PRODUCT'));
    await act(async () => { await result.current.openCreate(); });
    act(() => {
      result.current.setForm({ name: 'Bad', description: '', discountPercentage: '5', discountPriorityId: 'p1', attrs: {} });
    });
    await act(async () => { await result.current.handleSave(); });
    const toast = (await import('react-hot-toast')).default;
    expect(toast.error).toHaveBeenCalled();
  });

  it('handleDelete error shows toast', async () => {
    mockRulesService.delete.mockRejectedValueOnce(new Error('fail'));
    const { result } = renderHook(() => useRules(discountTypes, 'PRODUCT'));
    act(() => { result.current.setDeleteTarget({ id: 'r1' } as any); });
    await act(async () => { await result.current.handleDelete(); });
    const toast = (await import('react-hot-toast')).default;
    expect(toast.error).toHaveBeenCalled();
  });
});
