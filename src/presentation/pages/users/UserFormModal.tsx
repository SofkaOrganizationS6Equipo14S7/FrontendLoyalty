import { Input, Select, FormModal } from '@/presentation/components/ui';
import type { EcommerceResponse, RoleResponse } from '@/domain/types';

interface UserFormData {
  username: string;
  email: string;
  password: string;
  roleId: string;
  ecommerceId: string;
}

interface UserFormModalProps {
  isOpen: boolean;
  isEditing: boolean;
  form: UserFormData;
  ecommerces: EcommerceResponse[];
  roles: RoleResponse[];
  saving: boolean;
  onFormChange: (form: UserFormData) => void;
  onSave: () => void;
  onClose: () => void;
}

export function UserFormModal({
  isOpen, isEditing, form, ecommerces, roles, saving,
  onFormChange, onSave, onClose,
}: UserFormModalProps) {
  const selectedRole = roles.find((r) => r.id === form.roleId);
  const isSuperAdmin = selectedRole?.name === 'SUPER_ADMIN';

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit User' : 'Add New User'}
      description={isEditing ? 'Update user details.' : 'Invite a new member to the platform and assign their role.'}
      onSubmit={onSave}
      submitLabel={isEditing ? 'Save Changes' : 'Send Invite'}
      saving={saving}
      submitDisabled={!form.username}
    >
      <Input
        label="Name"
        placeholder="John Doe"
        value={form.username}
        onChange={(e) => onFormChange({ ...form, username: e.target.value })}
      />
      <Input
        label="Email"
        type="email"
        placeholder="john@example.com"
        value={form.email}
        onChange={(e) => onFormChange({ ...form, email: e.target.value })}
      />
      {!isEditing && (
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={form.password}
          onChange={(e) => onFormChange({ ...form, password: e.target.value })}
        />
      )}
      {!isEditing ? (
        <Select
          label="Role"
          options={[
            { value: '', label: 'Select role...' },
            ...roles.map((r) => ({ value: r.id, label: r.name.replace(/_/g, ' ') })),
          ]}
          value={form.roleId}
          onChange={(e) => onFormChange({ ...form, roleId: e.target.value })}
        />
      ) : (
        <Input
          label="Role"
          value={selectedRole?.name.replace(/_/g, ' ') || form.roleId}
          disabled
        />
      )}
      {ecommerces.length > 0 && !isSuperAdmin && (
        <Select
          label="Store"
          options={[
            { value: '', label: 'Select store...' },
            ...ecommerces.filter((e) => e.status === 'ACTIVE').map((e) => ({ value: e.uid, label: e.name })),
          ]}
          value={form.ecommerceId}
          onChange={(e) => onFormChange({ ...form, ecommerceId: e.target.value })}
        />
      )}
    </FormModal>
  );
}
