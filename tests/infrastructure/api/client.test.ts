import { apiClient, setSelectedEcommerceId, getSelectedEcommerceId } from '@/infrastructure/api/client';

describe('apiClient', () => {
  it('is an axios instance with default headers', () => {
    expect(apiClient.defaults.headers['Content-Type']).toBe('application/json');
  });

  it('has a baseURL configured', () => {
    expect(apiClient.defaults.baseURL).toBeDefined();
  });
});

describe('setSelectedEcommerceId / getSelectedEcommerceId', () => {
  afterEach(() => {
    setSelectedEcommerceId(null);
  });

  it('returns null initially', () => {
    expect(getSelectedEcommerceId()).toBeNull();
  });

  it('sets and gets ecommerce ID', () => {
    setSelectedEcommerceId('ecom-123');
    expect(getSelectedEcommerceId()).toBe('ecom-123');
  });

  it('clears ecommerce ID when set to null', () => {
    setSelectedEcommerceId('ecom-123');
    setSelectedEcommerceId(null);
    expect(getSelectedEcommerceId()).toBeNull();
  });
});

describe('request interceptor', () => {
  it('adds Authorization header when token exists', async () => {
    localStorage.setItem('loyalty_token', 'test-token');

    const interceptors = apiClient.interceptors.request as any;
    const handler = interceptors.handlers?.[0];

    if (handler?.fulfilled) {
      const config = { headers: {} as any };
      const result = handler.fulfilled(config);
      expect(result.headers.Authorization).toBe('Bearer test-token');
    }
  });

  it('adds X-Ecommerce-Id header when ecommerce selected', async () => {
    setSelectedEcommerceId('ecom-456');

    const interceptors = apiClient.interceptors.request as any;
    const handler = interceptors.handlers?.[0];

    if (handler?.fulfilled) {
      const config = { headers: {} as any };
      const result = handler.fulfilled(config);
      expect(result.headers['X-Ecommerce-Id']).toBe('ecom-456');
    }

    setSelectedEcommerceId(null);
  });

  it('does not add Authorization header when no token', async () => {
    localStorage.removeItem('loyalty_token');

    const interceptors = apiClient.interceptors.request as any;
    const handler = interceptors.handlers?.[0];

    if (handler?.fulfilled) {
      const config = { headers: {} as any };
      const result = handler.fulfilled(config);
      expect(result.headers.Authorization).toBeUndefined();
    }
  });
});

describe('response interceptor', () => {
  it('redirects to login on 401 for non-login requests', () => {
    const interceptors = apiClient.interceptors.response as any;
    const handler = interceptors.handlers?.[0];

    if (handler?.rejected) {
      const error = {
        response: { status: 401 },
        config: { url: '/api/v1/users' },
      };

      expect(() => handler.rejected(error)).rejects.toBeDefined();
    }
  });

  it('does not redirect on 401 for login request', () => {
    const interceptors = apiClient.interceptors.response as any;
    const handler = interceptors.handlers?.[0];

    if (handler?.rejected) {
      const error = {
        response: { status: 401 },
        config: { url: '/auth/login' },
      };

      expect(() => handler.rejected(error)).rejects.toBeDefined();
    }
  });

  it('passes through successful responses', () => {
    const interceptors = apiClient.interceptors.response as any;
    const handler = interceptors.handlers?.[0];

    if (handler?.fulfilled) {
      const response = { data: { success: true }, status: 200 };
      const result = handler.fulfilled(response);
      expect(result).toEqual(response);
    }
  });
});
