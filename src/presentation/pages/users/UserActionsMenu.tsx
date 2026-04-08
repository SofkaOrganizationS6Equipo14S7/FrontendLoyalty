import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/presentation/components/ui';
import type { UserResponse } from '@/domain/types';

interface UserActionsMenuProps {
  user: UserResponse;
  isOpen: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onToggleActive: () => void;
  onDelete: () => void;
}

export function UserActionsMenu({ user, isOpen, onToggle, onEdit, onToggleActive, onDelete }: UserActionsMenuProps) {
  return (
    <div className="relative inline-block">
      <Button variant="ghost" size="icon" onClick={onToggle}>
        <MoreHorizontal className="h-4 w-4" />
      </Button>
      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-36 rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-950 z-10">
          <button
            className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 rounded-t-lg"
            onClick={onEdit}
          >
            Edit
          </button>
          <button
            className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            onClick={onToggleActive}
          >
            {user.isActive ? 'Deactivate' : 'Activate'}
          </button>
          <button
            className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-b-lg"
            onClick={onDelete}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
