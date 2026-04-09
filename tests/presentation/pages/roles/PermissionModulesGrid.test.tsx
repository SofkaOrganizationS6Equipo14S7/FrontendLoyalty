import { render, screen } from '@testing-library/react';
import { PermissionModulesGrid } from '@/presentation/pages/roles/PermissionModulesGrid';
import type { PermissionResponse } from '@/domain/types';

const allPermissions: PermissionResponse[] = [
  { id: 'p1', code: 'USERS_READ', description: 'Read users', module: 'USERS' },
  { id: 'p2', code: 'USERS_WRITE', description: 'Write users', module: 'USERS' },
  { id: 'p3', code: 'RULES_READ', description: 'Read rules', module: 'RULES' },
] as PermissionResponse[];

describe('PermissionModulesGrid', () => {
  const base = {
    modules: ['USERS', 'RULES'],
    allPermissions,
  };

  it('renders title', () => {
    render(<PermissionModulesGrid {...base} />);
    expect(screen.getByText('Permission Modules')).toBeInTheDocument();
  });

  it('renders module names', () => {
    render(<PermissionModulesGrid {...base} />);
    expect(screen.getByText('USERS')).toBeInTheDocument();
    expect(screen.getByText('RULES')).toBeInTheDocument();
  });

  it('renders permission count badges', () => {
    render(<PermissionModulesGrid {...base} />);
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });
});
