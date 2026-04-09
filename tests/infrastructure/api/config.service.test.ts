import { configService } from '@/infrastructure/api/config.service';
import { apiClient } from '@/infrastructure/api/client';

vi.mock('@/infrastructure/api/client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
  },
}));

describe('configService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('get', () => {
    it('calls GET /discount-config with ecommerceId', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({ data: { id: 'c1' } });
      const result = await configService.get('e1');
      expect(apiClient.get).toHaveBeenCalledWith('/discount-config', { params: { ecommerceId: 'e1' } });
      expect(result.id).toBe('c1');
    });
  });

  describe('create', () => {
    it('calls POST /discount-config', async () => {
      const payload = {
        ecommerceId: 'e1', currency: 'CLP', roundingRule: 'ROUND_HALF_UP',
        cap: { type: 'PERCENTAGE' as const, value: 50 },
        priority: [{ type: 'SEASONAL', order: 1 }],
      };
      vi.mocked(apiClient.post).mockResolvedValue({ data: { id: 'c1' } });
      await configService.create(payload);
      expect(apiClient.post).toHaveBeenCalledWith('/discount-config', payload);
    });
  });

  describe('createConfiguration', () => {
    it('calls POST /configurations', async () => {
      const payload = {
        ecommerceId: 'e1', currency: 'USD', roundingRule: 'ROUND_DOWN',
        cap: { type: 'FIXED' as const, value: 100 },
        priority: [],
      };
      vi.mocked(apiClient.post).mockResolvedValue({ data: { success: true } });
      await configService.createConfiguration(payload);
      expect(apiClient.post).toHaveBeenCalledWith('/configurations', payload);
    });
  });

  describe('patchConfiguration', () => {
    it('calls PATCH /configurations/:ecommerceId', async () => {
      const payload = { currency: 'EUR' };
      vi.mocked(apiClient.patch).mockResolvedValue({ data: { success: true } });
      await configService.patchConfiguration('e1', payload);
      expect(apiClient.patch).toHaveBeenCalledWith('/configurations/e1', payload);
    });
  });

  describe('setPriorities', () => {
    it('calls POST /discount-priority', async () => {
      const payload = {
        discountConfigId: 'c1',
        priorities: [{ discountType: 'SEASONAL', priorityLevel: 1 }],
      };
      vi.mocked(apiClient.post).mockResolvedValue({ data: {} });
      await configService.setPriorities(payload);
      expect(apiClient.post).toHaveBeenCalledWith('/discount-priority', payload);
    });
  });

  describe('getPriorities', () => {
    it('calls GET /discount-priority with discountSettingId', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({ data: [] });
      await configService.getPriorities('ds1');
      expect(apiClient.get).toHaveBeenCalledWith('/discount-priority', { params: { discountSettingId: 'ds1' } });
    });
  });
});
