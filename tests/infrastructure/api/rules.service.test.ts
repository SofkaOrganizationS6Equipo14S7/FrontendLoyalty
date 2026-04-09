import { rulesService, tiersService } from '@/infrastructure/api/rules.service';
import { apiClient } from '@/infrastructure/api/client';

vi.mock('@/infrastructure/api/client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('rulesService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getDiscountTypes', () => {
    it('calls GET /rules/discount-types', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({ data: [{ id: 'd1', code: 'SEASONAL' }] });
      const result = await rulesService.getDiscountTypes();
      expect(apiClient.get).toHaveBeenCalledWith('/rules/discount-types');
      expect(result).toEqual([{ id: 'd1', code: 'SEASONAL' }]);
    });
  });

  describe('getAttributes', () => {
    it('calls GET /rules/attributes with discountTypeId', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({ data: [] });
      await rulesService.getAttributes('d1');
      expect(apiClient.get).toHaveBeenCalledWith('/rules/attributes', { params: { discountTypeId: 'd1' } });
    });
  });

  describe('getDiscountPriorities', () => {
    it('calls GET /rules/discount-priorities', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({ data: [] });
      await rulesService.getDiscountPriorities('d1');
      expect(apiClient.get).toHaveBeenCalledWith('/rules/discount-priorities', { params: { discountTypeId: 'd1' } });
    });
  });

  describe('list', () => {
    it('calls GET /rules with params', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({ data: { content: [] } });
      await rulesService.list({ page: 0, size: 10 });
      expect(apiClient.get).toHaveBeenCalledWith('/rules', { params: { page: 0, size: 10 } });
    });

    it('calls GET /rules without params', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({ data: { content: [] } });
      await rulesService.list();
      expect(apiClient.get).toHaveBeenCalledWith('/rules', { params: undefined });
    });
  });

  describe('getById', () => {
    it('calls GET /rules/:id', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({ data: { id: 'r1' } });
      const result = await rulesService.getById('r1');
      expect(apiClient.get).toHaveBeenCalledWith('/rules/r1');
      expect(result.id).toBe('r1');
    });
  });

  describe('create', () => {
    it('calls POST /rules', async () => {
      const payload = { name: 'Rule 1', discountPercentage: 10, discountPriorityId: 'p1', attributes: {} };
      vi.mocked(apiClient.post).mockResolvedValue({ data: { id: 'r1', ...payload } });
      const result = await rulesService.create(payload);
      expect(apiClient.post).toHaveBeenCalledWith('/rules', payload);
      expect(result.id).toBe('r1');
    });
  });

  describe('update', () => {
    it('calls PUT /rules/:id', async () => {
      const payload = { name: 'Updated', discountPercentage: 20, discountPriorityId: 'p1', attributes: {} };
      vi.mocked(apiClient.put).mockResolvedValue({ data: { id: 'r1' } });
      await rulesService.update('r1', payload);
      expect(apiClient.put).toHaveBeenCalledWith('/rules/r1', payload);
    });
  });

  describe('delete', () => {
    it('calls DELETE /rules/:id', async () => {
      vi.mocked(apiClient.delete).mockResolvedValue({});
      await rulesService.delete('r1');
      expect(apiClient.delete).toHaveBeenCalledWith('/rules/r1');
    });
  });

  describe('addTiers', () => {
    it('calls POST /rules/:id/tiers', async () => {
      vi.mocked(apiClient.post).mockResolvedValue({ data: { id: 'r1' } });
      await rulesService.addTiers('r1', ['t1', 't2']);
      expect(apiClient.post).toHaveBeenCalledWith('/rules/r1/tiers', { customerTierIds: ['t1', 't2'] });
    });
  });

  describe('getRuleTiers', () => {
    it('calls GET /rules/:id/tiers', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({ data: [] });
      await rulesService.getRuleTiers('r1');
      expect(apiClient.get).toHaveBeenCalledWith('/rules/r1/tiers');
    });
  });

  describe('removeTier', () => {
    it('calls DELETE /rules/:id/tiers/:tierId', async () => {
      vi.mocked(apiClient.delete).mockResolvedValue({});
      await rulesService.removeTier('r1', 't1');
      expect(apiClient.delete).toHaveBeenCalledWith('/rules/r1/tiers/t1');
    });
  });

  describe('getClassificationRules', () => {
    it('calls GET /rules/customer-tiers/:tierId', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({ data: [] });
      await rulesService.getClassificationRules('t1');
      expect(apiClient.get).toHaveBeenCalledWith('/rules/customer-tiers/t1');
    });
  });

  describe('createClassificationRule', () => {
    it('calls POST /rules/customer-tiers/:tierId', async () => {
      const payload = { metricType: 'ORDERS', minValue: 0, maxValue: 100, priority: 1 };
      vi.mocked(apiClient.post).mockResolvedValue({ data: { id: 'cr1' } });
      await rulesService.createClassificationRule('t1', payload);
      expect(apiClient.post).toHaveBeenCalledWith('/rules/customer-tiers/t1', payload);
    });
  });

  describe('updateClassificationRule', () => {
    it('calls PUT /rules/customer-tiers/:tierId/:ruleId', async () => {
      const payload = { metricType: 'REVENUE' };
      vi.mocked(apiClient.put).mockResolvedValue({ data: { id: 'cr1' } });
      await rulesService.updateClassificationRule('t1', 'cr1', payload);
      expect(apiClient.put).toHaveBeenCalledWith('/rules/customer-tiers/t1/cr1', payload);
    });
  });

  describe('deleteClassificationRule', () => {
    it('calls DELETE /rules/customer-tiers/:tierId/:ruleId', async () => {
      vi.mocked(apiClient.delete).mockResolvedValue({});
      await rulesService.deleteClassificationRule('t1', 'cr1');
      expect(apiClient.delete).toHaveBeenCalledWith('/rules/customer-tiers/t1/cr1');
    });
  });
});

describe('tiersService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('list', () => {
    it('calls GET /customer-tiers', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({ data: { content: [] } });
      await tiersService.list();
      expect(apiClient.get).toHaveBeenCalledWith('/customer-tiers', { params: undefined });
    });

    it('calls GET /customer-tiers with params', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({ data: { content: [] } });
      await tiersService.list({ isActive: true, page: 0, size: 10 });
      expect(apiClient.get).toHaveBeenCalledWith('/customer-tiers', { params: { isActive: true, page: 0, size: 10 } });
    });
  });

  describe('getById', () => {
    it('calls GET /customer-tiers/:id', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({ data: { id: 't1' } });
      const result = await tiersService.getById('t1');
      expect(apiClient.get).toHaveBeenCalledWith('/customer-tiers/t1');
      expect(result.id).toBe('t1');
    });
  });

  describe('create', () => {
    it('calls POST /customer-tiers', async () => {
      const payload = { ecommerceId: 'e1', name: 'Gold', discountPercentage: 15, hierarchyLevel: 2 };
      vi.mocked(apiClient.post).mockResolvedValue({ data: { id: 't2', ...payload } });
      const result = await tiersService.create(payload);
      expect(apiClient.post).toHaveBeenCalledWith('/customer-tiers', payload);
      expect(result.id).toBe('t2');
    });
  });

  describe('update', () => {
    it('calls PUT /customer-tiers/:id', async () => {
      const payload = { name: 'Platinum', discountPercentage: 20, hierarchyLevel: 3 };
      vi.mocked(apiClient.put).mockResolvedValue({ data: { id: 't1' } });
      await tiersService.update('t1', payload);
      expect(apiClient.put).toHaveBeenCalledWith('/customer-tiers/t1', payload);
    });
  });

  describe('delete', () => {
    it('calls DELETE /customer-tiers/:id', async () => {
      vi.mocked(apiClient.delete).mockResolvedValue({});
      await tiersService.delete('t1');
      expect(apiClient.delete).toHaveBeenCalledWith('/customer-tiers/t1');
    });
  });

  describe('activate', () => {
    it('calls PUT /customer-tiers/:id/activate', async () => {
      vi.mocked(apiClient.put).mockResolvedValue({ data: { id: 't1', isActive: true } });
      const result = await tiersService.activate('t1');
      expect(apiClient.put).toHaveBeenCalledWith('/customer-tiers/t1/activate');
      expect(result.isActive).toBe(true);
    });
  });
});
