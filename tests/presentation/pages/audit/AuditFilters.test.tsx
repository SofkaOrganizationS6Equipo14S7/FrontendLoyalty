import { render, screen } from '@testing-library/react';
import { AuditFilters } from '@/presentation/pages/audit/AuditFilters';
import type { EcommerceResponse } from '@/domain/types';

const ecommerces: EcommerceResponse[] = [
  { uid: 'e1', name: 'Store A', slug: 'store-a', status: 'ACTIVE', createdAt: '' } as EcommerceResponse,
  { uid: 'e2', name: 'Store B', slug: 'store-b', status: 'INACTIVE', createdAt: '' } as EcommerceResponse,
];

describe('AuditFilters', () => {
  const base = {
    ecommerces,
    filterEcommerce: '',
    filterEntity: '',
    onEcommerceChange: vi.fn(),
    onEntityChange: vi.fn(),
  };

  it('renders two selects', () => {
    const { container } = render(<AuditFilters {...base} />);
    expect(container.querySelectorAll('select')).toHaveLength(2);
  });

  it('filters only ACTIVE ecommerces in options', () => {
    const { container } = render(<AuditFilters {...base} />);
    const firstSelect = container.querySelectorAll('select')[0];
    const options = firstSelect.querySelectorAll('option');
    const texts = Array.from(options).map(o => o.textContent);
    expect(texts).toContain('Store A');
    expect(texts).not.toContain('Store B');
  });

  it('renders entity filter options', () => {
    const { container } = render(<AuditFilters {...base} />);
    const secondSelect = container.querySelectorAll('select')[1];
    const options = secondSelect.querySelectorAll('option');
    const texts = Array.from(options).map(o => o.textContent);
    expect(texts).toContain('Users');
    expect(texts).toContain('Rules');
    expect(texts).toContain('All entities');
  });

  it('calls onEcommerceChange on select change', async () => {
    const user = (await import('@testing-library/user-event')).default.setup();
    const onEcommerceChange = vi.fn();
    const { container } = render(<AuditFilters {...base} onEcommerceChange={onEcommerceChange} />);
    const firstSelect = container.querySelectorAll('select')[0];
    await user.selectOptions(firstSelect, 'e1');
    expect(onEcommerceChange).toHaveBeenCalledWith('e1');
  });

  it('calls onEntityChange on select change', async () => {
    const user = (await import('@testing-library/user-event')).default.setup();
    const onEntityChange = vi.fn();
    const { container } = render(<AuditFilters {...base} onEntityChange={onEntityChange} />);
    const secondSelect = container.querySelectorAll('select')[1];
    await user.selectOptions(secondSelect, 'rule');
    expect(onEntityChange).toHaveBeenCalledWith('rule');
  });
});
