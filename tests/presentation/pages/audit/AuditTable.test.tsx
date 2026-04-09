import { render, screen } from '@testing-library/react';
import { AuditTable } from '@/presentation/pages/audit/AuditTable';
import type { AuditLogResponse } from '@/domain/types';

vi.mock('date-fns', () => ({ format: () => '2024-01-15 10:30:00' }));

const log: AuditLogResponse = {
  id: 'a1',
  userId: 'user-12345678',
  action: 'CREATE',
  entityName: 'rule',
  oldValue: null,
  newValue: { name: 'Test Rule' },
  createdAt: '2024-01-15T10:30:00Z',
} as AuditLogResponse;

describe('AuditTable', () => {
  it('renders table headers', () => {
    render(<AuditTable logs={[log]} />);
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('User')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
    expect(screen.getByText('Entity')).toBeInTheDocument();
    expect(screen.getByText('Changes')).toBeInTheDocument();
  });

  it('renders action badge', () => {
    render(<AuditTable logs={[log]} />);
    expect(screen.getByText('CREATE')).toBeInTheDocument();
  });

  it('renders entity name', () => {
    render(<AuditTable logs={[log]} />);
    expect(screen.getByText('rule')).toBeInTheDocument();
  });

  it('renders user id slice when no users map', () => {
    render(<AuditTable logs={[log]} />);
    expect(screen.getByText('user-123')).toBeInTheDocument();
  });

  it('renders username from users map', () => {
    const users = new Map([['user-12345678', 'John Doe']]);
    render(<AuditTable logs={[log]} users={users} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('renders new value changes', () => {
    render(<AuditTable logs={[log]} />);
    expect(screen.getByText('Test Rule')).toBeInTheDocument();
  });

  it('renders old value with strikethrough', () => {
    const logWithOld = { ...log, oldValue: { name: 'Old' }, newValue: { name: 'New' } };
    render(<AuditTable logs={[logWithOld]} />);
    expect(screen.getByText('Old')).toBeInTheDocument();
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('renders dash when no old/new values', () => {
    const logEmpty = { ...log, oldValue: null, newValue: null };
    render(<AuditTable logs={[logEmpty]} />);
    expect(screen.getByText('-')).toBeInTheDocument();
  });
});
