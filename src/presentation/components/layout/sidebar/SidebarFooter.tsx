import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSidebarStore } from '@/infrastructure/store';

export function SidebarFooter() {
  const { isCollapsed, setOpen, setCollapsed } = useSidebarStore();
  const location = useLocation();
  const isSettingsActive = location.pathname === '/settings';

  return (
    <div className="border-t border-slate-200 p-3 dark:border-slate-800">
      <NavLink
        to="/settings"
        className={cn(
          'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors group',
          isCollapsed && 'justify-center px-2',
          isSettingsActive
            ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-50',
        )}
        onClick={() => setOpen(false)}
      >
        <Settings className="h-5 w-5 shrink-0 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
        {!isCollapsed && <span>Settings</span>}
      </NavLink>

      <button
        onClick={() => setCollapsed(!isCollapsed)}
        className="hidden lg:flex w-full items-center justify-center rounded-md p-2 mt-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
      >
        {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
      </button>
    </div>
  );
}
