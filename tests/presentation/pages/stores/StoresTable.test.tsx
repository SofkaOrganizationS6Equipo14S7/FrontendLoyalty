import { render, screen } from '@testing-library/react';
import { StoresTable } from '@/presentation/pages/stores/StoresTable';
import type { EcommerceResponse } from '@/domain/types';

vi.mock('date-fns', () => ({ format: () => '2024-01-15' }));

const store: EcommerceResponse = {
  uid: 's1',
  name: 'My Store',
  slug: 'my-store',
  status: 'ACTIVE',
  createdAt: '2024-01-15T00:00:00Z',
} as EcommerceResponse;

describe('StoresTable', () => {
  const base = { ecommerces: [store], onOpenDetail: vi.fn(), onToggleStatus: vi.fn() };

  it('renders table headers', () => {
    render(<StoresTable {...base} />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Slug')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('renders store name and slug', () => {
    render(<StoresTable {...base} />);
    expect(screen.getByText('My Store')).toBeInTheDocument();
    expect(screen.getByText('my-store')).toBeInTheDocument();
  });

  it('renders API Keys button', () => {
    render(<StoresTable {...base} />);
    expect(screen.getByText('API Keys')).toBeInTheDocument();
  });

  it('shows Disable for active store', () => {
    render(<StoresTable {...base} />);
    expect(screen.getByText('Disable')).toBeInTheDocument();
  });

  it('shows Enable for inactive store', () => {
    render(<StoresTable {...base} ecommerces={[{ ...store, status: 'INACTIVE' }]} />);
    expect(screen.getByText('Enable')).toBeInTheDocument();
  });

  it('calls onOpenDetail on API Keys click', async () => {
    const onOpenDetail = vi.fn();
    render(<StoresTable {...base} onOpenDetail={onOpenDetail} />);
    screen.getByText('API Keys').click();
    expect(onOpenDetail).toHaveBeenCalledWith(store);
  });

  it('calls onToggleStatus on Disable click', () => {
    const onToggle = vi.fn();
    render(<StoresTable {...base} onToggleStatus={onToggle} />);
    screen.getByText('Disable').click();
    expect(onToggle).toHaveBeenCalledWith(store);
  });
});
