import { Zap, X } from 'lucide-react';
import { useSidebarStore } from '@/infrastructure/store';

export function SidebarHeader() {
  const { isCollapsed, setOpen } = useSidebarStore();

  return (
    <div className="flex h-16 shrink-0 items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600">
          <Zap className="h-5 w-5 text-white" />
        </div>
        {!isCollapsed && (
          <span className="truncate text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
            LoyaltyEngine
          </span>
        )}
      </div>
      <button
        onClick={() => setOpen(false)}
        className="lg:hidden p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}
