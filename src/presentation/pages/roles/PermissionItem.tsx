import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PermissionResponse } from '@/domain/types';

interface PermissionItemProps {
  permission: PermissionResponse;
  checked: boolean;
  onToggle: (permId: string) => void;
}

export function PermissionItem({ permission, checked, onToggle }: PermissionItemProps) {
  return (
    <button
      onClick={() => onToggle(permission.id)}
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
        <span className="font-medium text-slate-900 dark:text-slate-100">{permission.code}</span>
        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{permission.description}</p>
      </div>
    </button>
  );
}
