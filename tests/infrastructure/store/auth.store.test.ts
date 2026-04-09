import { useAuthStore } from '@/infrastructure/store/auth.store';
import { authService } from '@/infrastructure/api';
import type { UserResponse } from '@/domain/types';

vi.mock('@/infrastructure/api', () => ({
  authService: {
    login: vi.fn(),
    logout: vi.fn(),
    me: vi.fn(),
  },
}));

const mockUser: UserResponse = {
  uid: 'u1',
  username: 'admin',
  roleId: 'r1',
  roleName: 'SUPER_ADMIN',
  email: 'admin@test.com',
  ecommerceId: null,
  isActive: true,
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
};

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  });

  it('has correct initial state', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isLoading).toBe(false);
  });

  it('login sets token and loads user', async () => {
    vi.mocked(authService.login).mockResolvedValue({
      token: 'test-token',
      tipo: 'Bearer',
      username: 'admin',
      role: 'SUPER_ADMIN',
    });
    vi.mocked(authService.me).mockResolvedValue(mockUser);

    await useAuthStore.getState().login('admin', 'password');

    const state = useAuthStore.getState();
    expect(state.token).toBe('test-token');
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toEqual(mockUser);
    expect(localStorage.setItem).toHaveBeenCalledWith('loyalty_token', 'test-token');
  });

  it('logout clears state and localStorage', async () => {
    vi.mocked(authService.logout).mockResolvedValue(undefined as any);
    useAuthStore.setState({ user: mockUser, token: 'token', isAuthenticated: true });

    await useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(localStorage.removeItem).toHaveBeenCalledWith('loyalty_token');
    expect(localStorage.removeItem).toHaveBeenCalledWith('loyalty_user');
  });

  it('logout handles error gracefully', async () => {
    vi.mocked(authService.logout).mockRejectedValue(new Error('Network error'));
    useAuthStore.setState({ user: mockUser, token: 'token', isAuthenticated: true });

    await useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('loadUser fetches user and stores it', async () => {
    vi.mocked(authService.me).mockResolvedValue(mockUser);

    await useAuthStore.getState().loadUser();

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.isLoading).toBe(false);
    expect(localStorage.setItem).toHaveBeenCalledWith('loyalty_user', JSON.stringify(mockUser));
  });

  it('loadUser clears auth on failure', async () => {
    vi.mocked(authService.me).mockRejectedValue(new Error('Unauthorized'));
    useAuthStore.setState({ token: 'token', isAuthenticated: true });

    await useAuthStore.getState().loadUser();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isLoading).toBe(false);
  });

  it('setUser stores user in state and localStorage', () => {
    useAuthStore.getState().setUser(mockUser);

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(localStorage.setItem).toHaveBeenCalledWith('loyalty_user', JSON.stringify(mockUser));
  });

  it('hasRole returns true when user has the role', () => {
    useAuthStore.setState({ user: mockUser });
    expect(useAuthStore.getState().hasRole('SUPER_ADMIN')).toBe(true);
  });

  it('hasRole returns false when user has different role', () => {
    useAuthStore.setState({ user: mockUser });
    expect(useAuthStore.getState().hasRole('STORE_USER')).toBe(false);
  });

  it('hasRole returns false when no user', () => {
    expect(useAuthStore.getState().hasRole('SUPER_ADMIN')).toBe(false);
  });

  it('hasRole accepts multiple roles', () => {
    useAuthStore.setState({ user: mockUser });
    expect(useAuthStore.getState().hasRole('SUPER_ADMIN', 'STORE_ADMIN')).toBe(true);
  });
});
