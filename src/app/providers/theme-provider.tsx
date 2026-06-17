import { useEffect, type PropsWithChildren } from 'react';
import { useThemeStore } from '@/app/stores/theme';

export function ThemeProvider({ children }: PropsWithChildren) {
  const darkMode = useThemeStore((state) => state.isOpenDarkMode);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return children;
}
