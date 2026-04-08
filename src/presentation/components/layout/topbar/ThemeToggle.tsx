import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '@/infrastructure/store';

export function ThemeToggle() {
  const { theme, setTheme } = useThemeStore();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
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
  );
}
