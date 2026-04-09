import { rolesService } from '@/infrastructure/api/roles.service';
import { apiClient } from '@/infrastructure/api/client';

vi.mock('@/infrastructure/api/client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe('rolesService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('list', () => {
    it('calls GET /roles', async () => {
      const mockRoles = [{ id: 'r1', name: 'SUPER_ADMIN' }];
      vi.mocked(apiClient.get).mockResolvedValue({ data: mockRoles });

      const result = await rolesService.list();

      expect(apiClient.get).toHaveBeenCalledWith('/roles');
      expect(result).toEqual(mockRoles);
    });
  });

  describe('getById', () => {
    it('calls GET /roles/:id', async () => {
      const mockRole = { id: 'r1', name: 'SUPER_ADMIN', permissions: [] };
      vi.mocked(apiClient.get).mockResolvedValue({ data: mockRole });

      const result = await rolesService.getById('r1');

      expect(apiClient.get).toHaveBeenCalledWith('/roles/r1');
      expect(result).toEqual(mockRole);
    });
  });

  describe('getPermissions', () => {
    it('calls GET /permissions without module', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({ data: [] });

      await rolesService.getPermissions();

      expect(apiClient.get).toHaveBeenCalledWith('/permissions', { params: {} });
    });

    it('calls GET /permissions with module filter', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({ data: [] });

      await rolesService.getPermissions('USERS');

      expect(apiClient.get).toHaveBeenCalledWith('/permissions', { params: { module: 'USERS' } });
    });
  });

  describe('assignPermissions', () => {
    it('calls POST /roles/:id/permissions', async () => {
      const mockResult = { id: 'r1', name: 'ADMIN', permissions: [] };
      vi.mocked(apiClient.post).mockResolvedValue({ data: mockResult });

      const result = await rolesService.assignPermissions('r1', ['p1', 'p2']);

      expect(apiClient.post).toHaveBeenCalledWith('/roles/r1/permissions', { permissionIds: ['p1', 'p2'] });
      expect(result).toEqual(mockResult);
    });
  });
});
