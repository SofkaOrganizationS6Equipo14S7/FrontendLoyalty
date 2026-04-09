import { authService } from '@/infrastructure/api/auth.service';
import { apiClient } from '@/infrastructure/api/client';

vi.mock('@/infrastructure/api/client', () => ({
  apiClient: {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
  },
}));

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('calls POST /auth/login with credentials', async () => {
      const mockResponse = { data: { token: 'tok', tipo: 'Bearer', username: 'admin', role: 'SUPER_ADMIN' } };
      vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

      const result = await authService.login({ username: 'admin', password: 'pass' });

      expect(apiClient.post).toHaveBeenCalledWith('/auth/login', { username: 'admin', password: 'pass' });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('logout', () => {
    it('calls POST /auth/logout', async () => {
      vi.mocked(apiClient.post).mockResolvedValue({});

      await authService.logout();

      expect(apiClient.post).toHaveBeenCalledWith('/auth/logout');
    });
  });

  describe('me', () => {
    it('calls GET /auth/me', async () => {
      const mockUser = { uid: 'u1', username: 'admin' };
      vi.mocked(apiClient.get).mockResolvedValue({ data: mockUser });

      const result = await authService.me();

      expect(apiClient.get).toHaveBeenCalledWith('/auth/me');
      expect(result).toEqual(mockUser);
    });
  });

  describe('updateProfile', () => {
    it('calls PUT /users/me with data', async () => {
      const mockUser = { uid: 'u1', email: 'new@test.com' };
      vi.mocked(apiClient.put).mockResolvedValue({ data: mockUser });

      const result = await authService.updateProfile({ email: 'new@test.com' });

      expect(apiClient.put).toHaveBeenCalledWith('/users/me', { email: 'new@test.com' });
      expect(result).toEqual(mockUser);
    });
  });

  describe('changePassword', () => {
    it('calls PUT /users/me/password', async () => {
      const mockResponse = { data: { token: 'new-tok' } };
      vi.mocked(apiClient.put).mockResolvedValue(mockResponse);

      const payload = { currentPassword: 'old', newPassword: 'new', confirmPassword: 'new' };
      const result = await authService.changePassword(payload);

      expect(apiClient.put).toHaveBeenCalledWith('/users/me/password', payload);
      expect(result).toEqual(mockResponse.data);
    });
  });
});
