import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import type { NavItem } from '../navigation.config';

interface SidebarNavItemProps {
  item: NavItem;
  isActive: boolean;
  isCollapsed: boolean;
  onClick?: () => void;
}

export function SidebarNavItem({ item, isActive, isCollapsed, onClick }: SidebarNavItemProps) {
  return (
    <NavLink
      to={item.href}
      className={cn(
        'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors group relative',
        isCollapsed && 'justify-center px-2',
        isActive
          ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-50',
      )}
      title={isCollapsed ? item.name : undefined}
      onClick={onClick}
    >
      <item.icon
        className={cn(
          'h-5 w-5 shrink-0',
          isActive
            ? 'text-indigo-600 dark:text-indigo-400'
            : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300',
        )}
      />
      {!isCollapsed && <span>{item.name}</span>}
    </NavLink>
  );
}
