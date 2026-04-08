import { create } from 'zustand';

type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
  resolved: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggle: () => void;
}

function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function resolveTheme(theme: Theme): 'light' | 'dark' {
  return theme === 'system' ? getSystemTheme() : theme;
}

function applyTheme(resolved: 'light' | 'dark') {
  document.documentElement.classList.toggle('dark', resolved === 'dark');
}

const stored = (localStorage.getItem('loyalty_theme') as Theme) || 'system';
const initialResolved = resolveTheme(stored);
applyTheme(initialResolved);

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: stored,
  resolved: initialResolved,

  setTheme: (theme) => {
    const resolved = resolveTheme(theme);
    localStorage.setItem('loyalty_theme', theme);
    applyTheme(resolved);
    set({ theme, resolved });
  },

  toggle: () => {
    const current = get().resolved;
    const next = current === 'light' ? 'dark' : 'light';
    get().setTheme(next);
  },
}));

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  const state = useThemeStore.getState();
  if (state.theme === 'system') {
    const resolved = getSystemTheme();
    applyTheme(resolved);
    useThemeStore.setState({ resolved });
  }
});
