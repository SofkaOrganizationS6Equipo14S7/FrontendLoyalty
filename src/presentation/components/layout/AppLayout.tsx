import { useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { Sidebar } from './sidebar';
import { TopBar } from './topbar';
import { useAuthStore, useSidebarStore } from '@/infrastructure/store';

export function AppLayout() {
  const { isAuthenticated, user, isLoading, loadUser } = useAuthStore();
  const { setCollapsed } = useSidebarStore();

  useEffect(() => {
    if (isAuthenticated && !user) {
      loadUser();
    }
  }, [isAuthenticated, user, loadUser]);

  useEffect(() => {
    const handleResize = () => {
      setCollapsed(window.innerWidth < 1280);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setCollapsed]);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-slate-950/50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-indigo-600 flex items-center justify-center animate-pulse">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950/50 text-slate-900 dark:text-slate-50">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <TopBar />
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
