import { useEffect, useState, useCallback } from 'react';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { usersService, ecommercesService } from '@/infrastructure/api';
import { useAuthStore } from '@/infrastructure/store';
import {
  Card,
  Button,
  ConfirmModal,
  PageHeader,
  PaginationFooter,
  SearchInput,
} from '@/presentation/components/ui';
import type { UserResponse, EcommerceResponse } from '@/domain/types';
import { UsersTable } from './UsersTable';
import { UserFormModal } from './UserFormModal';

const PAGE_SIZE = 5;

export function UsersPage() {
  const { user: authUser } = useAuthStore();
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [ecommerces, setEcommerces] = useState<EcommerceResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserResponse | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<UserResponse | null>(null);
  const [form, setForm] = useState({ username: '', email: '', password: '', roleId: '', ecommerceId: '' });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [res, ecomRes] = await Promise.all([
        usersService.list({ page, size: PAGE_SIZE }),
        ecommercesService.list().catch(() => ({ content: [] })),
      ]);
      setUsers(res.content || []);
      setTotalPages(res.totalPages || 1);
      setTotalElements(res.totalElements || 0);
      setEcommerces(ecomRes.content || []);
    } catch {
      toast.error('Error loading users');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = users.filter((u) => u.username.toLowerCase().includes(search.toLowerCase()));

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingUser) {
        await usersService.update(editingUser.uid, {
          username: form.username,
          email: form.email,
          roleId: form.roleId,
          ecommerceId: form.ecommerceId || undefined,
        });
        toast.success('User updated');
      } else {
        await usersService.create({
          username: form.username,
          email: form.email,
          password: form.password,
          roleId: form.roleId,
          ecommerceId: form.ecommerceId || undefined,
        });
        toast.success('User created');
      }
      setShowModal(false);
      load();
    } catch {
      toast.error('Error saving user');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await usersService.delete(deleteTarget.uid);
      toast.success('User deleted');
      setDeleteTarget(null);
      load();
    } catch {
      toast.error('Error deleting user');
    }
  };

  const openCreate = () => {
    setEditingUser(null);
    setForm({ username: '', email: '', password: '', roleId: '', ecommerceId: '' });
    setShowModal(true);
  };

  const openEdit = (u: UserResponse) => {
    setEditingUser(u);
    setForm({ username: u.username, email: u.email || '', password: '', roleId: u.roleId, ecommerceId: u.ecommerceId || '' });
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description="Manage team members and their roles across stores."
        actions={
          authUser?.roleName === 'SUPER_ADMIN' ? (
            <Button onClick={openCreate} className="gap-2">
              <Plus className="h-4 w-4" />
              Add User
            </Button>
          ) : undefined
        }
      />

      <Card>
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search users..."
            className="max-w-sm w-full"
          />
        </div>

        <UsersTable
          users={filtered}
          loading={loading}
          pageSize={PAGE_SIZE}
          onEdit={openEdit}
          onDelete={setDeleteTarget}
        />

        <PaginationFooter
          page={page}
          pageSize={PAGE_SIZE}
          totalPages={totalPages}
          totalElements={totalElements}
          onPageChange={setPage}
        />
      </Card>

      <UserFormModal
        isOpen={showModal}
        isEditing={!!editingUser}
        form={form}
        ecommerces={ecommerces}
        saving={saving}
        onFormChange={setForm}
        onSave={handleSave}
        onClose={() => setShowModal(false)}
      />

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete User"
        message={`Are you sure you want to delete "${deleteTarget?.username}"? This action cannot be undone.`}
        confirmLabel="Delete"
      />
    </div>
  );
}
