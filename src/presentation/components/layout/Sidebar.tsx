import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Store,
  Tag,
  History,
  ActivitySquare,
  Shield,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
  Zap,
} from 'lucide-react';
import { useAuthStore, useSidebarStore } from '@/infrastructure/store';
import { motion } from 'motion/react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Users', href: '/users', icon: Users, roles: ['SUPER_ADMIN', 'STORE_ADMIN'] },
  { name: 'Stores', href: '/stores', icon: Store, roles: ['SUPER_ADMIN'] },
  { name: 'Discounts', href: '/discounts', icon: Tag },
  { name: 'Transactions', href: '/transactions', icon: History },
  { name: 'Audit Log', href: '/audit', icon: ActivitySquare, roles: ['SUPER_ADMIN'] },
  { name: 'Roles', href: '/roles', icon: Shield, roles: ['SUPER_ADMIN'] },
];

export function Sidebar() {
  const { user } = useAuthStore();
  const { isOpen, isCollapsed, setOpen, setCollapsed } = useSidebarStore();
  const location = useLocation();

  const filteredNav = navigation.filter(
    (item) => !item.roles || (user && item.roles.includes(user.roleName))
  );

  const toggleExpanded = () => setCollapsed(!isCollapsed);

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/80 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <motion.div
        layout
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-slate-200 dark:bg-slate-950 dark:border-slate-800 transition-all duration-300 ease-in-out lg:translate-x-0 lg:static",
          isOpen ? "translate-x-0" : "-translate-x-full",
          isCollapsed ? "w-[72px]" : "w-64",
        )}
      >
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

        <nav className="flex flex-1 flex-col overflow-y-auto px-3 py-4 space-y-1">
          {filteredNav.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors group relative",
                  isCollapsed && "justify-center px-2",
                  isActive
                    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-50"
                )}
                title={isCollapsed ? item.name : undefined}
                onClick={() => setOpen(false)}
              >
                <item.icon className={cn("h-5 w-5 shrink-0", isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300")} />
                {!isCollapsed && <span>{item.name}</span>}
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-slate-200 p-3 dark:border-slate-800">
          <NavLink
            to="/settings"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors group",
              isCollapsed && "justify-center px-2",
              location.pathname === '/settings'
                ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-50"
            )}
            onClick={() => setOpen(false)}
          >
            <Settings className="h-5 w-5 shrink-0 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
            {!isCollapsed && <span>Settings</span>}
          </NavLink>

          <button
            onClick={toggleExpanded}
            className="hidden lg:flex w-full items-center justify-center rounded-md p-2 mt-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
          >
            {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
        </div>
      </motion.div>
    </>
  );
}
