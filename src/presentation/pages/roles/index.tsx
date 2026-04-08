import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { rolesService } from '@/infrastructure/api';
import { PageHeader } from '@/presentation/components/ui';
import type { RoleResponse, PermissionResponse, RoleWithPermissionsResponse } from '@/domain/types';
import { RolesTable } from './RolesTable';
import { PermissionModulesGrid } from './PermissionModulesGrid';
import { PermissionAssignModal } from './PermissionAssignModal';

export function RolesPermissionsPage() {
  const [roles, setRoles] = useState<RoleResponse[]>([]);
  const [allPermissions, setAllPermissions] = useState<PermissionResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAssign, setShowAssign] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleWithPermissionsResponse | null>(null);
  const [selectedPermIds, setSelectedPermIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [permSearch, setPermSearch] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [rolesData, permsData] = await Promise.all([
        rolesService.list(),
        rolesService.getPermissions(),
      ]);
      setRoles(rolesData);
      setAllPermissions(permsData);
    } catch {
      toast.error('Error loading roles data');
    } finally {
      setLoading(false);
    }
  };

  const openAssign = async (role: RoleResponse) => {
    try {
      const full = await rolesService.getById(role.id);
      setSelectedRole(full);
      setSelectedPermIds(full.permissions.map((p) => p.id));
      setPermSearch('');
      setShowAssign(true);
    } catch {
      toast.error('Error loading role details');
    }
  };

  const handleSavePermissions = async () => {
    if (!selectedRole) return;
    setSaving(true);
    try {
      await rolesService.assignPermissions(selectedRole.id, selectedPermIds);
      toast.success('Permissions updated');
      setShowAssign(false);
      loadData();
    } catch {
      toast.error('Error saving permissions');
    } finally {
      setSaving(false);
    }
  };

  const togglePermission = (permId: string) => {
    setSelectedPermIds((prev) =>
      prev.includes(permId) ? prev.filter((id) => id !== permId) : [...prev, permId],
    );
  };

  const modules = [...new Set(allPermissions.map((p) => p.module))].sort();

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
