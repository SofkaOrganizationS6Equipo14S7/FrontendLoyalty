import { renderHook, act } from '@testing-library/react';
import { useTiers } from '@/presentation/pages/discounts/useTiers';

const mockTiersService = vi.hoisted(() => ({
  list: vi.fn().mockResolvedValue({ content: [{ id: 't1', name: 'Gold', discountPercentage: 15, hierarchyLevel: 1 }] }),
  create: vi.fn().mockResolvedValue({}),
  update: vi.fn().mockResolvedValue({}),
  delete: vi.fn().mockResolvedValue({}),
  activate: vi.fn().mockResolvedValue({}),
}));

const mockRulesService = vi.hoisted(() => ({
  getClassificationRules: vi.fn().mockResolvedValue([{ id: 'cr1', metricType: 'REVENUE' }]),
  createClassificationRule: vi.fn().mockResolvedValue({}),
  updateClassificationRule: vi.fn().mockResolvedValue({}),
  deleteClassificationRule: vi.fn().mockResolvedValue({}),
}));

vi.mock('@/infrastructure/api', () => ({
  tiersService: mockTiersService,
  rulesService: mockRulesService,
}));

vi.mock('react-hot-toast', () => ({ default: { success: vi.fn(), error: vi.fn() } }));

describe('useTiers', () => {
  beforeEach(() => vi.clearAllMocks());

  it('loadTiers fetches tiers', async () => {
    const { result } = renderHook(() => useTiers('e1'));
    await act(async () => { await result.current.loadTiers(); });
    expect(result.current.tiers).toHaveLength(1);
    expect(result.current.tiers[0].name).toBe('Gold');
  });

  it('openCreate opens form with empty state', () => {
    const { result } = renderHook(() => useTiers('e1'));
    act(() => result.current.openCreate());
    expect(result.current.showForm).toBe(true);
    expect(result.current.editingTier).toBeNull();
  });

  it('openEdit populates form with tier data', () => {
    const { result } = renderHook(() => useTiers('e1'));
    const tier = { id: 't1', name: 'Gold', discountPercentage: 15, hierarchyLevel: 1 };
    act(() => result.current.openEdit(tier as any));
    expect(result.current.showForm).toBe(true);
    expect(result.current.form.name).toBe('Gold');
  });

  it('handleSave creates a new tier', async () => {
    const { result } = renderHook(() => useTiers('e1'));
    act(() => result.current.openCreate());
    act(() => { result.current.setForm({ name: 'Silver', discountPercentage: '10', hierarchyLevel: '2' }); });
    await act(async () => { await result.current.handleSave(); });
    expect(mockTiersService.create).toHaveBeenCalled();
    expect(result.current.showForm).toBe(false);
  });

  it('handleSave updates an existing tier', async () => {
    const { result } = renderHook(() => useTiers('e1'));
    act(() => result.current.openEdit({ id: 't1', name: 'Gold', discountPercentage: 15, hierarchyLevel: 1 } as any));
    await act(async () => { await result.current.handleSave(); });
    expect(mockTiersService.update).toHaveBeenCalledWith('t1', expect.any(Object));
  });

  it('handleDelete deletes a tier', async () => {
    const { result } = renderHook(() => useTiers('e1'));
    act(() => result.current.setDeleteTarget({ id: 't1' } as any));
    await act(async () => { await result.current.handleDelete(); });
    expect(mockTiersService.delete).toHaveBeenCalledWith('t1');
  });

  it('handleDelete does nothing without target', async () => {
    const { result } = renderHook(() => useTiers('e1'));
    await act(async () => { await result.current.handleDelete(); });
    expect(mockTiersService.delete).not.toHaveBeenCalled();
  });

  it('handleActivate activates a tier', async () => {
    const { result } = renderHook(() => useTiers('e1'));
    await act(async () => { await result.current.handleActivate({ id: 't1' } as any); });
    expect(mockTiersService.activate).toHaveBeenCalledWith('t1');
  });

  it('toggleTierExpand loads classification rules', async () => {
    const { result } = renderHook(() => useTiers('e1'));
    await act(async () => { result.current.toggleTierExpand('t1'); });
    expect(result.current.expandedTier).toBe('t1');
    expect(mockRulesService.getClassificationRules).toHaveBeenCalledWith('t1');
  });

  it('toggleTierExpand collapses when same tier', async () => {
    const { result } = renderHook(() => useTiers('e1'));
    await act(async () => { result.current.toggleTierExpand('t1'); });
    await act(async () => { result.current.toggleTierExpand('t1'); });
    expect(result.current.expandedTier).toBeNull();
  });

  it('handleClassSave creates classification rule', async () => {
    const { result } = renderHook(() => useTiers('e1'));
    act(() => result.current.openClassCreate('t1'));
    act(() => {
      result.current.setClassForm({ metricType: 'REVENUE', minValue: '0', maxValue: '100', priority: '1' });
    });
    await act(async () => { await result.current.handleClassSave(); });
    expect(mockRulesService.createClassificationRule).toHaveBeenCalledWith('t1', expect.any(Object));
  });

  it('handleClassDelete deletes classification rule', async () => {
    const { result } = renderHook(() => useTiers('e1'));
    await act(async () => { await result.current.handleClassDelete('t1', 'cr1'); });
    expect(mockRulesService.deleteClassificationRule).toHaveBeenCalledWith('t1', 'cr1');
  });

  it('openClassEdit populates class form', () => {
    const { result } = renderHook(() => useTiers('e1'));
    const rule = { id: 'cr1', metricType: 'REVENUE', minValue: 100, maxValue: 500, priority: 2 };
    act(() => result.current.openClassEdit('t1', rule as any));
    expect(result.current.showClassForm).toBe(true);
    expect(result.current.editingClassRule).toBeTruthy();
    expect(result.current.classForm.metricType).toBe('REVENUE');
  });

  it('handleClassSave updates existing classification rule', async () => {
    const { result } = renderHook(() => useTiers('e1'));
    const rule = { id: 'cr1', metricType: 'REVENUE', minValue: 100, maxValue: 500, priority: 2 };
    act(() => result.current.openClassEdit('t1', rule as any));
    await act(async () => { await result.current.handleClassSave(); });
    expect(mockRulesService.updateClassificationRule).toHaveBeenCalledWith('t1', 'cr1', expect.any(Object));
  });

  it('loadTiers handles error gracefully', async () => {
    mockTiersService.list.mockRejectedValueOnce(new Error('fail'));
    const { result } = renderHook(() => useTiers('e1'));
    await act(async () => { await result.current.loadTiers(); });
    expect(result.current.tiers).toHaveLength(0);
  });

  it('handleSave error shows toast', async () => {
    mockTiersService.create.mockRejectedValueOnce(new Error('fail'));
    const { result } = renderHook(() => useTiers('e1'));
    act(() => result.current.openCreate());
    act(() => { result.current.setForm({ name: 'Bad', discountPercentage: '5', hierarchyLevel: '1' }); });
    await act(async () => { await result.current.handleSave(); });
    const toast = (await import('react-hot-toast')).default;
    expect(toast.error).toHaveBeenCalled();
  });

  it('handleDelete error shows toast', async () => {
    mockTiersService.delete.mockRejectedValueOnce(new Error('fail'));
    const { result } = renderHook(() => useTiers('e1'));
    act(() => result.current.setDeleteTarget({ id: 't1' } as any));
    await act(async () => { await result.current.handleDelete(); });
    const toast = (await import('react-hot-toast')).default;
    expect(toast.error).toHaveBeenCalled();
  });

  it('handleActivate error shows toast', async () => {
    mockTiersService.activate.mockRejectedValueOnce(new Error('fail'));
    const { result } = renderHook(() => useTiers('e1'));
    await act(async () => { await result.current.handleActivate({ id: 't1' } as any); });
    const toast = (await import('react-hot-toast')).default;
    expect(toast.error).toHaveBeenCalled();
  });

  it('handleClassSave error shows toast', async () => {
    mockRulesService.createClassificationRule.mockRejectedValueOnce(new Error('fail'));
    const { result } = renderHook(() => useTiers('e1'));
    act(() => result.current.openClassCreate('t1'));
    act(() => { result.current.setClassForm({ metricType: 'REVENUE', minValue: '0', maxValue: '100', priority: '1' }); });
    await act(async () => { await result.current.handleClassSave(); });
    const toast = (await import('react-hot-toast')).default;
    expect(toast.error).toHaveBeenCalled();
  });

  it('handleClassDelete error shows toast', async () => {
    mockRulesService.deleteClassificationRule.mockRejectedValueOnce(new Error('fail'));
    const { result } = renderHook(() => useTiers('e1'));
    await act(async () => { await result.current.handleClassDelete('t1', 'cr1'); });
    const toast = (await import('react-hot-toast')).default;
    expect(toast.error).toHaveBeenCalled();
  });

  it('loadClassRules handles error', async () => {
    mockRulesService.getClassificationRules.mockRejectedValueOnce(new Error('fail'));
    const { result } = renderHook(() => useTiers('e1'));
    await act(async () => { result.current.toggleTierExpand('t1'); });
    expect(result.current.classRules).toBeDefined();
  });
});
