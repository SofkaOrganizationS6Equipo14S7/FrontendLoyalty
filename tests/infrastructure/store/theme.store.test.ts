import { useThemeStore } from '@/infrastructure/store/theme.store';

describe('useThemeStore', () => {
  beforeEach(() => {
    useThemeStore.setState({ theme: 'system', resolved: 'light' });
    document.documentElement.classList.remove('dark');
  });

  it('has initial theme state', () => {
    const state = useThemeStore.getState();
    expect(state.theme).toBeDefined();
    expect(['light', 'dark']).toContain(state.resolved);
  });

  it('setTheme to dark applies dark class', () => {
    useThemeStore.getState().setTheme('dark');

    const state = useThemeStore.getState();
    expect(state.theme).toBe('dark');
    expect(state.resolved).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.setItem).toHaveBeenCalledWith('loyalty_theme', 'dark');
  });

  it('setTheme to light removes dark class', () => {
    document.documentElement.classList.add('dark');
    useThemeStore.getState().setTheme('light');

    const state = useThemeStore.getState();
    expect(state.theme).toBe('light');
    expect(state.resolved).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('toggle switches light to dark', () => {
    useThemeStore.setState({ resolved: 'light' });
    useThemeStore.getState().toggle();
    expect(useThemeStore.getState().resolved).toBe('dark');
  });

  it('toggle switches dark to light', () => {
    useThemeStore.setState({ resolved: 'dark', theme: 'dark' });
    useThemeStore.getState().toggle();
    expect(useThemeStore.getState().resolved).toBe('light');
  });

  it('setTheme system resolves based on matchMedia', () => {
    useThemeStore.getState().setTheme('system');
    expect(useThemeStore.getState().theme).toBe('system');
    expect(useThemeStore.getState().resolved).toBe('light');
  });
});
