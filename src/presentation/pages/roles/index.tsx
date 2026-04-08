import { PageHeader } from '@/presentation/components/ui';
import { RolesTable } from './RolesTable';
import { PermissionModulesGrid } from './PermissionModulesGrid';
import { PermissionAssignModal } from './PermissionAssignModal';
import { useRolesPermissions } from './useRolesPermissions';

export function RolesPermissionsPage() {
  const {
    roles, allPermissions, loading, modules,
    showAssign, setShowAssign, selectedRole,
    selectedPermIds, saving, permSearch, setPermSearch,
    openAssign, handleSavePermissions, togglePermission,
  } = useRolesPermissions();

  return (
    <div className="space-y-6 max-w-5xl">
      <PageHeader
        title="Roles & Permissions"
        description="Manage system roles and their associated permissions."
      />

      <RolesTable roles={roles} loading={loading} onManagePermissions={openAssign} />

      <PermissionModulesGrid modules={modules} allPermissions={allPermissions} />

      <PermissionAssignModal
        isOpen={showAssign}
        selectedRole={selectedRole}
        allPermissions={allPermissions}
        selectedPermIds={selectedPermIds}
        modules={modules}
        permSearch={permSearch}
        saving={saving}
        onClose={() => setShowAssign(false)}
        onSearchChange={setPermSearch}
        onTogglePermission={togglePermission}
        onSave={handleSavePermissions}
      />
    </div>
  );
}
