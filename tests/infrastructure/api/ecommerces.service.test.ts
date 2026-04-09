import { ecommercesService } from '@/infrastructure/api/ecommerces.service';
import { apiClient } from '@/infrastructure/api/client';

vi.mock('@/infrastructure/api/client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('ecommercesService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('list', () => {
    it('calls GET /ecommerces with params', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({ data: { content: [] } });

      const result = await ecommercesService.list({ status: 'ACTIVE', page: 0, size: 10 });

      expect(apiClient.get).toHaveBeenCalledWith('/ecommerces', { params: { status: 'ACTIVE', page: 0, size: 10 } });
      expect(result).toEqual({ content: [] });
    });

    it('calls GET /ecommerces without params', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({ data: { content: [] } });

      await ecommercesService.list();

      expect(apiClient.get).toHaveBeenCalledWith('/ecommerces', { params: undefined });
    });
  });

  describe('getById', () => {
    it('calls GET /ecommerces/:uid', async () => {
      const mockStore = { uid: 'e1', name: 'Store 1' };
      vi.mocked(apiClient.get).mockResolvedValue({ data: mockStore });

      const result = await ecommercesService.getById('e1');

      expect(apiClient.get).toHaveBeenCalledWith('/ecommerces/e1');
      expect(result).toEqual(mockStore);
    });
  });

  describe('create', () => {
    it('calls POST /ecommerces', async () => {
      const payload = { name: 'New Store', slug: 'new-store' };
      vi.mocked(apiClient.post).mockResolvedValue({ data: { uid: 'e2', ...payload } });

      const result = await ecommercesService.create(payload);

      expect(apiClient.post).toHaveBeenCalledWith('/ecommerces', payload);
      expect(result.uid).toBe('e2');
    });
  });

  describe('updateStatus', () => {
    it('calls PUT /ecommerces/:uid/status', async () => {
      vi.mocked(apiClient.put).mockResolvedValue({ data: { uid: 'e1', status: 'INACTIVE' } });

      const result = await ecommercesService.updateStatus('e1', { status: 'INACTIVE' });

      expect(apiClient.put).toHaveBeenCalledWith('/ecommerces/e1/status', { status: 'INACTIVE' });
      expect(result.status).toBe('INACTIVE');
    });
  });

  describe('listApiKeys', () => {
    it('calls GET /ecommerces/:id/api-keys', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({ data: [] });

      const result = await ecommercesService.listApiKeys('e1');

      expect(apiClient.get).toHaveBeenCalledWith('/ecommerces/e1/api-keys');
      expect(result).toEqual([]);
    });
  });

  describe('createApiKey', () => {
    it('calls POST /ecommerces/:id/api-keys', async () => {
      const mockKey = { keyId: 'k1', key: 'secret', prefix: 'sk_' };
      vi.mocked(apiClient.post).mockResolvedValue({ data: mockKey });

      const result = await ecommercesService.createApiKey('e1');

      expect(apiClient.post).toHaveBeenCalledWith('/ecommerces/e1/api-keys');
      expect(result).toEqual(mockKey);
    });
  });

  describe('deleteApiKey', () => {
    it('calls DELETE /ecommerces/:id/api-keys/:keyId', async () => {
      vi.mocked(apiClient.delete).mockResolvedValue({});

      await ecommercesService.deleteApiKey('e1', 'k1');

      expect(apiClient.delete).toHaveBeenCalledWith('/ecommerces/e1/api-keys/k1');
    });
  });
});
