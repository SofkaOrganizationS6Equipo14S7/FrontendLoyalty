import { usersService } from '@/infrastructure/api/users.service';
import { apiClient } from '@/infrastructure/api/client';

vi.mock('@/infrastructure/api/client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('usersService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('list', () => {
    it('calls GET /users with params', async () => {
      const mockData = { content: [], totalElements: 0 };
      vi.mocked(apiClient.get).mockResolvedValue({ data: mockData });

      const result = await usersService.list({ page: 0, size: 10 });

      expect(apiClient.get).toHaveBeenCalledWith('/users', { params: { page: 0, size: 10 } });
      expect(result).toEqual(mockData);
    });

    it('calls GET /users without params', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({ data: { content: [] } });

      await usersService.list();

      expect(apiClient.get).toHaveBeenCalledWith('/users', { params: undefined });
    });
  });

  describe('getById', () => {
    it('calls GET /users/:uid', async () => {
      const mockUser = { uid: 'u1', username: 'test' };
      vi.mocked(apiClient.get).mockResolvedValue({ data: mockUser });

      const result = await usersService.getById('u1');

      expect(apiClient.get).toHaveBeenCalledWith('/users/u1');
      expect(result).toEqual(mockUser);
    });
  });

  describe('create', () => {
    it('calls POST /users with data', async () => {
      const payload = { username: 'new', email: 'n@t.com', password: 'pass', roleId: 'r1' };
      vi.mocked(apiClient.post).mockResolvedValue({ data: { uid: 'u2', ...payload } });

      const result = await usersService.create(payload);

      expect(apiClient.post).toHaveBeenCalledWith('/users', payload);
      expect(result.uid).toBe('u2');
    });
  });

  describe('update', () => {
    it('calls PUT /users/:uid with data', async () => {
      const payload = { username: 'updated' };
      vi.mocked(apiClient.put).mockResolvedValue({ data: { uid: 'u1', username: 'updated' } });

      const result = await usersService.update('u1', payload);

      expect(apiClient.put).toHaveBeenCalledWith('/users/u1', payload);
      expect(result.username).toBe('updated');
    });
  });

  describe('delete', () => {
    it('calls DELETE /users/:uid', async () => {
      vi.mocked(apiClient.delete).mockResolvedValue({});

      await usersService.delete('u1');

      expect(apiClient.delete).toHaveBeenCalledWith('/users/u1');
    });
  });
});
