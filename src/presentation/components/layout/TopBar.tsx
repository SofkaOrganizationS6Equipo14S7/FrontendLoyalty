import { useLocation } from 'react-router-dom';
import { Menu, Moon, Sun, Bell, User } from 'lucide-react';
import { useAuthStore } from '@/infrastructure/store';
import { useSidebarStore } from '@/infrastructure/store';
import { useThemeStore } from '@/infrastructure/store';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/users': 'Users',
  '/stores': 'Stores',
  '/discounts': 'Discounts',
  '/transactions': 'Transactions',
  '/audit': 'Audit Log',
  '/roles': 'Roles & Permissions',
  '/settings': 'Settings',
};

export function TopBar() {
  const { theme, setTheme } = useThemeStore();
  const { user, logout } = useAuthStore();
  const { setOpen } = useSidebarStore();
  const location = useLocation();

  const title = pageTitles[location.pathname] || 'Dashboard';

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b border-slate-200 bg-white px-4 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:gap-x-6 sm:px-6 lg:px-8">
      <button
        type="button"
        className="-m-2.5 p-2.5 text-slate-700 lg:hidden dark:text-slate-300"
        onClick={() => setOpen(true)}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Separator */}
      <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 lg:hidden" aria-hidden="true" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1 items-center">
          <h1 className="text-xl font-semibold leading-7 text-slate-900 dark:text-white">
            {title}
          </h1>
        </div>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <button type="button" className="-m-2.5 p-2.5 text-slate-400 hover:text-slate-500 dark:hover:text-slate-300">
            <span className="sr-only">View notifications</span>
            <Bell className="h-5 w-5" aria-hidden="true" />
          </button>

          <button
            type="button"
            className="-m-2.5 p-2.5 text-slate-400 hover:text-slate-500 dark:hover:text-slate-300"
            onClick={toggleTheme}
          >
            <span className="sr-only">Toggle dark mode</span>
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Moon className="h-5 w-5" aria-hidden="true" />
            )}
          </button>

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-slate-200 dark:lg:bg-slate-800" aria-hidden="true" />

          {/* Profile dropdown */}
          <div className="relative group">
            <button className="-m-1.5 flex items-center p-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950 rounded-full">
              <span className="sr-only">Open user menu</span>
              <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
                <User className="h-4 w-4" />
              </div>
            </button>

            {/* Dropdown */}
            <div className="absolute right-0 top-full mt-2 w-56 origin-top-right rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-950 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{user?.username}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{user?.roleName}</p>
              </div>
              <div className="p-1">
                <button
                  onClick={logout}
                  className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
