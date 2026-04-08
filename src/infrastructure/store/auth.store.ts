import { create } from 'zustand';
import type { UserResponse, Role } from '@/domain/types';
import { authService } from '@/infrastructure/api';

interface AuthState {
  user: UserResponse | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  setUser: (user: UserResponse) => void;
  hasRole: (...roles: Role[]) => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem('loyalty_token'),
  isAuthenticated: !!localStorage.getItem('loyalty_token'),
  isLoading: false,

  login: async (username, password) => {
    const response = await authService.login({ username, password });
    localStorage.setItem('loyalty_token', response.token);
    set({ token: response.token, isAuthenticated: true });
    await get().loadUser();
  },

  logout: async () => {
    try {
      await authService.logout();
    } catch {
      // ignore
    }
    localStorage.removeItem('loyalty_token');
    localStorage.removeItem('loyalty_user');
    set({ user: null, token: null, isAuthenticated: false });
  },

  loadUser: async () => {
    set({ isLoading: true });
    try {
      const user = await authService.me();
      localStorage.setItem('loyalty_user', JSON.stringify(user));
      set({ user, isLoading: false });
    } catch {
      localStorage.removeItem('loyalty_token');
      localStorage.removeItem('loyalty_user');
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },

  setUser: (user) => {
    localStorage.setItem('loyalty_user', JSON.stringify(user));
    set({ user });
  },

  hasRole: (...roles) => {
    const { user } = get();
    if (!user) return false;
    return roles.includes(user.roleName as Role);
  },
}));
