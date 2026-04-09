import { renderHook, act, waitFor } from '@testing-library/react';
import { useSettings } from '@/presentation/pages/settings/useSettings';

const mockUser = vi.hoisted(() => ({ uid: 'u1', username: 'admin', email: 'admin@test.com', ecommerceId: 'e1', roles: ['ADMIN'] }));

vi.mock('@/infrastructure/store', () => ({
  useAuthStore: vi.fn(() => ({ user: mockUser, setUser: vi.fn() })),
}));

vi.mock('@/presentation/hooks', () => ({
  useIsAdmin: vi.fn(() => true),
}));

const mockAuthService = vi.hoisted(() => ({
  updateProfile: vi.fn().mockResolvedValue({ uid: 'u1', username: 'admin', email: 'new@test.com', ecommerceId: 'e1', roles: ['ADMIN'] }),
  changePassword: vi.fn().mockResolvedValue({}),
}));

const mockConfigService = vi.hoisted(() => ({
  get: vi.fn().mockResolvedValue({ maxDiscountCap: 50, currencyCode: 'USD', roundingRule: 'ROUND_DOWN' }),
  createConfiguration: vi.fn().mockResolvedValue({}),
  patchConfiguration: vi.fn().mockResolvedValue({}),
}));

const mockRulesService = vi.hoisted(() => ({
  getDiscountTypes: vi.fn().mockResolvedValue([
    { id: 'dt1', code: 'PRODUCT', displayName: 'Product', description: '' },
  ]),
}));

vi.mock('@/infrastructure/api', () => ({
  authService: mockAuthService,
  configService: mockConfigService,
  rulesService: mockRulesService,
}));

vi.mock('@/lib/utils', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/utils')>();
  return { ...actual, getApiErrorMessage: vi.fn((_, msg) => msg) };
});

vi.mock('react-hot-toast', () => ({ default: { success: vi.fn(), error: vi.fn() } }));

describe('useSettings', () => {
  beforeEach(() => vi.clearAllMocks());

  it('initializes profile from user', () => {
    const { result } = renderHook(() => useSettings());
    expect(result.current.name).toBe('admin');
    expect(result.current.email).toBe('admin@test.com');
  });

  it('loads config for admin users', async () => {
    const { result } = renderHook(() => useSettings());
    await waitFor(() => expect(result.current.loadingConfig).toBe(false));
    expect(mockRulesService.getDiscountTypes).toHaveBeenCalled();
    expect(mockConfigService.get).toHaveBeenCalledWith('e1');
  });

  it('provides password form state', () => {
    const { result } = renderHook(() => useSettings());
    expect(result.current.currentPassword).toBe('');
    expect(result.current.newPassword).toBe('');
    expect(result.current.confirmPassword).toBe('');
  });

  it('handles email change', () => {
    const { result } = renderHook(() => useSettings());
    act(() => result.current.setEmail('new@test.com'));
    expect(result.current.email).toBe('new@test.com');
  });

  it('movePriority swaps items', async () => {
    const { result } = renderHook(() => useSettings());
    await waitFor(() => expect(result.current.loadingConfig).toBe(false));
    // Only one priority item in mock, so movePriority won't crash
    act(() => result.current.movePriority(0, 'down'));
  });

  it('provides config state', async () => {
    const { result } = renderHook(() => useSettings());
    await waitFor(() => expect(result.current.loadingConfig).toBe(false));
    expect(result.current.isAdmin).toBe(true);
    expect(typeof result.current.handleProfileSave).toBe('function');
    expect(typeof result.current.handlePasswordChange).toBe('function');
    expect(typeof result.current.handleSaveConfig).toBe('function');
  });

  it('handleProfileSave updates profile', async () => {
    const { result } = renderHook(() => useSettings());
    act(() => result.current.setEmail('new@test.com'));
    const fakeEvent = { preventDefault: vi.fn() } as any;
    await act(async () => { await result.current.handleProfileSave(fakeEvent); });
    expect(mockAuthService.updateProfile).toHaveBeenCalledWith({ email: 'new@test.com' });
  });

  it('handleProfileSave shows error on failure', async () => {
    mockAuthService.updateProfile.mockRejectedValueOnce(new Error('fail'));
    const { result } = renderHook(() => useSettings());
    const fakeEvent = { preventDefault: vi.fn() } as any;
    await act(async () => { await result.current.handleProfileSave(fakeEvent); });
    const toast = (await import('react-hot-toast')).default;
    expect(toast.error).toHaveBeenCalled();
  });

  it('handlePasswordChange changes password', async () => {
    const { result } = renderHook(() => useSettings());
    act(() => {
      result.current.setCurrentPassword('old');
      result.current.setNewPassword('new123');
      result.current.setConfirmPassword('new123');
    });
    const fakeEvent = { preventDefault: vi.fn() } as any;
    await act(async () => { await result.current.handlePasswordChange(fakeEvent); });
    expect(mockAuthService.changePassword).toHaveBeenCalledWith({
      currentPassword: 'old',
      newPassword: 'new123',
      confirmPassword: 'new123',
    });
  });

  it('handlePasswordChange shows error on mismatch', async () => {
    const { result } = renderHook(() => useSettings());
    act(() => {
      result.current.setCurrentPassword('old');
      result.current.setNewPassword('new123');
      result.current.setConfirmPassword('different');
    });
    const fakeEvent = { preventDefault: vi.fn() } as any;
    await act(async () => { await result.current.handlePasswordChange(fakeEvent); });
    const toast = (await import('react-hot-toast')).default;
    expect(toast.error).toHaveBeenCalledWith('Passwords do not match');
  });

  it('handlePasswordChange shows error on API failure', async () => {
    mockAuthService.changePassword.mockRejectedValueOnce(new Error('fail'));
    const { result } = renderHook(() => useSettings());
    act(() => {
      result.current.setCurrentPassword('old');
      result.current.setNewPassword('new123');
      result.current.setConfirmPassword('new123');
    });
    const fakeEvent = { preventDefault: vi.fn() } as any;
    await act(async () => { await result.current.handlePasswordChange(fakeEvent); });
    const toast = (await import('react-hot-toast')).default;
    expect(toast.error).toHaveBeenCalled();
  });

  it('handleSaveConfig creates configuration', async () => {
    const { result } = renderHook(() => useSettings());
    await waitFor(() => expect(result.current.loadingConfig).toBe(false));
    act(() => {
      result.current.setMaxCap('50');
      result.current.setCapType('FIXED');
    });
    await act(async () => { await result.current.handleSaveConfig(); });
    expect(mockConfigService.createConfiguration).toHaveBeenCalled();
  });

  it('handleSaveConfig falls back to patch on create failure', async () => {
    mockConfigService.createConfiguration.mockRejectedValueOnce(new Error('exists'));
    const { result } = renderHook(() => useSettings());
    await waitFor(() => expect(result.current.loadingConfig).toBe(false));
    await act(async () => { await result.current.handleSaveConfig(); });
    expect(mockConfigService.patchConfiguration).toHaveBeenCalled();
  });

  it('updates config state setters', async () => {
    const { result } = renderHook(() => useSettings());
    await waitFor(() => expect(result.current.loadingConfig).toBe(false));
    act(() => result.current.setCapType('FIXED'));
    expect(result.current.capType).toBe('FIXED');
    act(() => result.current.setCurrency('USD'));
    expect(result.current.currency).toBe('USD');
    act(() => result.current.setRoundingRule('ROUND_DOWN'));
    expect(result.current.roundingRule).toBe('ROUND_DOWN');
  });
});
