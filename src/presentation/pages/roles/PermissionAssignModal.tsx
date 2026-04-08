import { Search } from 'lucide-react';
import { Modal, Button } from '@/presentation/components/ui';
import type { PermissionResponse, RoleWithPermissionsResponse } from '@/domain/types';
import { PermissionItem } from './PermissionItem';

interface PermissionAssignModalProps {
  isOpen: boolean;
  selectedRole: RoleWithPermissionsResponse | null;
  allPermissions: PermissionResponse[];
  selectedPermIds: string[];
  modules: string[];
  permSearch: string;
  saving: boolean;
  onClose: () => void;
  onSearchChange: (value: string) => void;
  onTogglePermission: (permId: string) => void;
  onSave: () => void;
}

export function PermissionAssignModal({
  isOpen,
  selectedRole,
  allPermissions,
  selectedPermIds,
  modules,
  permSearch,
  saving,
  onClose,
  onSearchChange,
  onTogglePermission,
  onSave,
}: PermissionAssignModalProps) {
  const filteredPermissions = allPermissions.filter(
    (p) =>
      p.code.toLowerCase().includes(permSearch.toLowerCase()) ||
      p.description.toLowerCase().includes(permSearch.toLowerCase()) ||
      p.module.toLowerCase().includes(permSearch.toLowerCase()),
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Permissions — ${selectedRole?.name}`}
      description="Toggle permissions for this role."
    >
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search permissions..."
            value={permSearch}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
          />
        </div>

        <div className="max-h-[400px] overflow-y-auto space-y-4 pr-1">
          {modules.map((mod) => {
            const modPerms = filteredPermissions.filter((p) => p.module === mod);
            if (modPerms.length === 0) return null;
            return (
              <div key={mod}>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">{mod}</h4>
                <div className="space-y-1">
                  {modPerms.map((perm) => (
                    <PermissionItem
                      key={perm.id}
                      permission={perm}
                      checked={selectedPermIds.includes(perm.id)}
                      onToggle={onTogglePermission}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs text-slate-500">
            {selectedPermIds.length} of {allPermissions.length} selected
          </span>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={onSave} isLoading={saving}>Save Permissions</Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
