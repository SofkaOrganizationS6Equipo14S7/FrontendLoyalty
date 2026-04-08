import { User } from 'lucide-react';
import { useAuthStore } from '@/infrastructure/store';

export function UserMenu() {
  const { user, logout } = useAuthStore();

  return (
    <div className="relative group">
      <button className="-m-1.5 flex items-center p-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950 rounded-full">
        <span className="sr-only">Open user menu</span>
        <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
          <User className="h-4 w-4" />
        </div>
      </button>

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
  );
}
