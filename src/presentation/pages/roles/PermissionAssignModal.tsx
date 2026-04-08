import { Search, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Modal, Button } from '@/presentation/components/ui';
import type { PermissionResponse, RoleWithPermissionsResponse } from '@/domain/types';

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
                  {modPerms.map((perm) => {
                    const checked = selectedPermIds.includes(perm.id);
                    return (
                      <button
                        key={perm.id}
                        onClick={() => onTogglePermission(perm.id)}
                        className={cn(
                          'flex items-center gap-3 w-full text-left p-2.5 rounded-lg border transition-colors text-sm',
                          checked
                            ? 'border-indigo-200 bg-indigo-50 dark:border-indigo-500/30 dark:bg-indigo-500/10'
                            : 'border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900',
                        )}
                      >
                        <div
                          className={cn(
                            'h-4 w-4 rounded border flex items-center justify-center shrink-0 transition-colors',
                            checked ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 dark:border-slate-600',
                          )}
                        >
                          {checked && <Check className="h-3 w-3 text-white" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="font-medium text-slate-900 dark:text-slate-100">{perm.code}</span>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{perm.description}</p>
                        </div>
                      </button>
                    );
                  })}
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
