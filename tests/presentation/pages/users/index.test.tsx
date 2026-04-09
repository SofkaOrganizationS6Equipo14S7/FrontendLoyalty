import { render, screen } from '@testing-library/react';

const mockUseUsers = vi.hoisted(() => vi.fn());
vi.mock('@/presentation/pages/users/useUsers', () => ({
  useUsers: mockUseUsers,
}));

vi.mock('@/infrastructure/store', () => ({
  useAuthStore: vi.fn(() => ({ hasRole: () => true })),
}));

import { UsersPage } from '@/presentation/pages/users';

describe('UsersPage', () => {
  const baseState = {
    filtered: [],
    ecommerces: [],
    roles: [],
    loading: false,
    search: '',
    setSearch: vi.fn(),
    page: 0,
    setPage: vi.fn(),
    totalPages: 0,
    totalElements: 0,
    PAGE_SIZE: 10,
    showModal: false,
    setShowModal: vi.fn(),
    editingUser: null,
    form: { username: '', email: '', password: '', roleId: '', ecommerceId: '' },
    setForm: vi.fn(),
    saving: false,
    openCreate: vi.fn(),
    openEdit: vi.fn(),
    handleSave: vi.fn(),
    handleToggleActive: vi.fn(),
    deleteTarget: null,
    setDeleteTarget: vi.fn(),
    handleDelete: vi.fn(),
  };

  it('renders page header', () => {
    mockUseUsers.mockReturnValue(baseState);
    render(<UsersPage />);
    expect(screen.getByText('Users')).toBeInTheDocument();
  });

  it('renders Add User button', () => {
    mockUseUsers.mockReturnValue(baseState);
    render(<UsersPage />);
    expect(screen.getByText('Add User')).toBeInTheDocument();
  });

  it('renders search input', () => {
    mockUseUsers.mockReturnValue(baseState);
    render(<UsersPage />);
    expect(screen.getByPlaceholderText('Search users...')).toBeInTheDocument();
  });

  it('renders empty table', () => {
    mockUseUsers.mockReturnValue(baseState);
    render(<UsersPage />);
    expect(screen.getByText('No users found.')).toBeInTheDocument();
  });

  it('renders users when available', () => {
    mockUseUsers.mockReturnValue({
      ...baseState,
      filtered: [{ uid: 'u1', username: 'john', email: 'j@t.com', roleName: 'ADMIN', isActive: true }],
    });
    render(<UsersPage />);
    expect(screen.getByText('john')).toBeInTheDocument();
  });

  it('calls openCreate when Add User clicked', async () => {
    const user = (await import('@testing-library/user-event')).default.setup();
    const openCreate = vi.fn();
    mockUseUsers.mockReturnValue({ ...baseState, openCreate });
    render(<UsersPage />);
    await user.click(screen.getByText('Add User'));
    expect(openCreate).toHaveBeenCalled();
  });

  it('renders delete confirmation when deleteTarget set', () => {
    mockUseUsers.mockReturnValue({ ...baseState, deleteTarget: { uid: 'u1', username: 'john' } });
    render(<UsersPage />);
    expect(screen.getByText(/Are you sure you want to delete/)).toBeInTheDocument();
  });

  it('renders modal when showModal is true', () => {
    mockUseUsers.mockReturnValue({ ...baseState, showModal: true });
    render(<UsersPage />);
    expect(screen.getByText('Add New User')).toBeInTheDocument();
  });
});
