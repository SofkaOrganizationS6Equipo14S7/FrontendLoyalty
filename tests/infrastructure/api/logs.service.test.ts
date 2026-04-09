import { auditService, discountLogsService } from '@/infrastructure/api/logs.service';
import { apiClient } from '@/infrastructure/api/client';

vi.mock('@/infrastructure/api/client', () => ({
  apiClient: {
    get: vi.fn(),
  },
}));

describe('auditService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('list', () => {
    it('calls GET /audit-logs with params', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({ data: { content: [] } });
      await auditService.list({ entityName: 'User', page: 0, size: 20 });
      expect(apiClient.get).toHaveBeenCalledWith('/audit-logs', {
        params: { entityName: 'User', page: 0, size: 20 },
      });
    });

    it('calls GET /audit-logs without params', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({ data: { content: [] } });
      await auditService.list();
      expect(apiClient.get).toHaveBeenCalledWith('/audit-logs', { params: undefined });
    });
  });

  describe('getById', () => {
    it('calls GET /audit-logs/:id', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({ data: { id: 'log1' } });
      const result = await auditService.getById('log1');
      expect(apiClient.get).toHaveBeenCalledWith('/audit-logs/log1');
      expect(result.id).toBe('log1');
    });
  });
});

describe('discountLogsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('list', () => {
    it('calls GET /discount-logs with params', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({ data: { content: [] } });
      await discountLogsService.list({ ecommerceId: 'e1', page: 0 });
      expect(apiClient.get).toHaveBeenCalledWith('/discount-logs', {
        params: { ecommerceId: 'e1', page: 0 },
      });
    });

    it('calls GET /discount-logs without params', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({ data: { content: [] } });
      await discountLogsService.list();
      expect(apiClient.get).toHaveBeenCalledWith('/discount-logs', { params: undefined });
    });
  });

  describe('getById', () => {
    it('calls GET /discount-logs/:id', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({ data: { id: 'dl1' } });
      const result = await discountLogsService.getById('dl1');
      expect(apiClient.get).toHaveBeenCalledWith('/discount-logs/dl1');
      expect(result.id).toBe('dl1');
    });
  });
});
