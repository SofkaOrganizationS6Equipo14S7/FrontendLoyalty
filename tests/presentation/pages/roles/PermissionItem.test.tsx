import { render, screen } from '@testing-library/react';
import { PermissionItem } from '@/presentation/pages/roles/PermissionItem';
import type { PermissionResponse } from '@/domain/types';

const perm: PermissionResponse = { id: 'p1', code: 'USERS_READ', description: 'Read users', module: 'USERS' } as PermissionResponse;

describe('PermissionItem', () => {
  const base = { permission: perm, checked: false, onToggle: vi.fn() };

  it('renders permission code', () => {
    render(<PermissionItem {...base} />);
    expect(screen.getByText('USERS_READ')).toBeInTheDocument();
  });

  it('renders description', () => {
    render(<PermissionItem {...base} />);
    expect(screen.getByText('Read users')).toBeInTheDocument();
  });

  it('calls onToggle with permission id on click', () => {
    const onToggle = vi.fn();
    render(<PermissionItem {...base} onToggle={onToggle} />);
    screen.getByRole('button').click();
    expect(onToggle).toHaveBeenCalledWith('p1');
  });

  it('shows checked state', () => {
    const { container } = render(<PermissionItem {...base} checked={true} />);
    expect(container.querySelector('.bg-indigo-600')).toBeInTheDocument();
  });
});
