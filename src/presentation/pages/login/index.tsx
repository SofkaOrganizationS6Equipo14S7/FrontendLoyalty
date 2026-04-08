import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/infrastructure/store';
import { getApiErrorMessage } from '@/presentation/hooks';
import { LoginBranding } from './LoginBranding';
import { LoginForm } from './LoginForm';

export function LoginPage() {
  const { login, isAuthenticated } = useAuthStore();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const handleLogin = async (username: string, password: string) => {
    setError('');
    setLoading(true);
    try {
      await login(username, password);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Invalid credentials'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-8">
          <LoginBranding />
          <LoginForm onSubmit={handleLogin} error={error} loading={loading} />
        </div>
      </div>
    </div>
  );
}
