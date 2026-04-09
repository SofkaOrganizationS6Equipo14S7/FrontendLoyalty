import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { Button } from '@/presentation/components/ui';

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold text-slate-900 dark:text-slate-100">404</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          The page you're looking for doesn't exist.
        </p>
        <Link to="/dashboard">
          <Button className="mt-4">
            <Home className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
