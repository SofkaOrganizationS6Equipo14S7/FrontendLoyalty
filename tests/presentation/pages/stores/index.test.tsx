import { render, screen } from '@testing-library/react';

vi.mock('date-fns', () => ({ format: () => '2024-01-15' }));

const mockUseStores = vi.hoisted(() => vi.fn());
vi.mock('@/presentation/pages/stores/useStores', () => ({
  useStores: mockUseStores,
}));

import { StoresPage } from '@/presentation/pages/stores';

describe('StoresPage', () => {
  const baseState = {
    ecommerces: [],
    loading: false,
    saving: false,
    page: 0,
    setPage: vi.fn(),
    totalPages: 0,
    totalElements: 0,
    PAGE_SIZE: 10,
    handleCreate: vi.fn(),
    handleToggleStatus: vi.fn(),
    detailEcommerce: null,
    setDetailEcommerce: vi.fn(),
    apiKeys: [],
    newKey: null,
    openDetail: vi.fn(),
    handleCreateKey: vi.fn(),
    handleDeleteKey: vi.fn(),
    showCreate: false,
    setShowCreate: vi.fn(),
  };

  it('renders page header', () => {
    mockUseStores.mockReturnValue(baseState);
    render(<StoresPage />);
    expect(screen.getByText('Ecommerce Management')).toBeInTheDocument();
  });

  it('renders loading state', () => {
    mockUseStores.mockReturnValue({ ...baseState, loading: true });
    const { container } = render(<StoresPage />);
    expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0);
  });

  it('renders empty state when no stores', () => {
    mockUseStores.mockReturnValue(baseState);
    render(<StoresPage />);
    expect(screen.getByText(/No stores yet/i)).toBeInTheDocument();
  });

  it('renders stores table when ecommerces exist', () => {
    mockUseStores.mockReturnValue({
      ...baseState,
      ecommerces: [{ uid: 'e1', name: 'Store 1', slug: 'store-1', status: 'ACTIVE', createdAt: '2024-01-01' }],
    });
    render(<StoresPage />);
    expect(screen.getByText('Store 1')).toBeInTheDocument();
  });

  it('renders Add Store button', () => {
    mockUseStores.mockReturnValue(baseState);
    render(<StoresPage />);
    expect(screen.getByText('Add Store')).toBeInTheDocument();
  });

  it('calls setShowCreate on Add Store click', async () => {
    const user = (await import('@testing-library/user-event')).default.setup();
    const setShowCreate = vi.fn();
    mockUseStores.mockReturnValue({ ...baseState, setShowCreate });
    render(<StoresPage />);
    await user.click(screen.getByText('Add Store'));
    expect(setShowCreate).toHaveBeenCalledWith(true);
  });

  it('renders pagination footer', () => {
    mockUseStores.mockReturnValue({ ...baseState, totalElements: 20, totalPages: 2 });
    render(<StoresPage />);
    expect(screen.getByText(/Showing/)).toBeInTheDocument();
  });
});
