import { useEffect } from 'react';
import { useUIStore } from '../../shared/stores/uiStore';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useUIStore((s) => s.theme);

  useEffect(() => {
    const root = document.documentElement;
    const apply = (dark: boolean) => {
      root.classList.toggle('dark', dark);
      root.setAttribute('data-theme', dark ? 'dark' : 'light');
      root.style.colorScheme = dark ? 'dark' : 'light';
    };
    if (theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      apply(mq.matches);
      const h = (e: MediaQueryListEvent) => apply(e.matches);
      mq.addEventListener('change', h);
      return () => mq.removeEventListener('change', h);
    }
    apply(theme === 'dark');
  }, [theme]);

  return <>{children}</>;
}
