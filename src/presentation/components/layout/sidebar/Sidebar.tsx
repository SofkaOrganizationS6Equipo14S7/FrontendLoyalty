import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuthStore, useSidebarStore } from '@/infrastructure/store';
import { motion } from 'motion/react';
import { navigation } from '../navigation.config';
import { SidebarHeader } from './SidebarHeader';
import { SidebarNavItem } from './SidebarNavItem';
import { SidebarFooter } from './SidebarFooter';

export function Sidebar() {
  const { user } = useAuthStore();
  const { isOpen, isCollapsed, setOpen } = useSidebarStore();
  const location = useLocation();

  const filteredNav = navigation.filter(
    (item) => !item.roles || (user && item.roles.includes(user.roleName))
  );

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/80 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <motion.div
        layout
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-slate-200 dark:bg-slate-950 dark:border-slate-800 transition-all duration-300 ease-in-out lg:translate-x-0 lg:static",
          isOpen ? "translate-x-0" : "-translate-x-full",
          isCollapsed ? "w-[72px]" : "w-64",
        )}
      >
        <SidebarHeader />

        <nav className="flex flex-1 flex-col overflow-y-auto px-3 py-4 space-y-1">
          {filteredNav.map((item) => (
            <SidebarNavItem
              key={item.name}
              item={item}
              isActive={location.pathname.startsWith(item.href)}
              isCollapsed={isCollapsed}
              onClick={() => setOpen(false)}
            />
          ))}
        </nav>

        <SidebarFooter />
      </motion.div>
    </>
  );
}
