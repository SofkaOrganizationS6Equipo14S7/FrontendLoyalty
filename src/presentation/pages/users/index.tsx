import { Plus } from 'lucide-react';
import { useAuthStore } from '@/infrastructure/store';
import {
  Card,
  Button,
  ConfirmModal,
  PageHeader,
  PaginationFooter,
  SearchInput,
} from '@/presentation/components/ui';
import { UsersTable } from './UsersTable';
import { UserFormModal } from './UserFormModal';
import { useUsers } from './useUsers';

export function UsersPage() {
  const { hasRole } = useAuthStore();
  const {
    filtered, ecommerces, roles, loading, search, setSearch,
    page, setPage, totalPages, totalElements, PAGE_SIZE,
    showModal, setShowModal, editingUser, form, setForm, saving,
    openCreate, openEdit, handleSave,
    handleToggleActive,
    deleteTarget, setDeleteTarget, handleDelete,
  } = useUsers();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description="Manage team members and their roles across stores."
        actions={
          hasRole('SUPER_ADMIN', 'STORE_ADMIN') ? (
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
          onToggleActive={handleToggleActive}
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
        roles={roles}
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
