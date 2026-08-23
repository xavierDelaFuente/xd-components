import { useEffect } from 'react';

export type ThemeProviderProps = {
  children: React.ReactNode;
  theme?: string;
  mode?: 'light' | 'dark';
};

export function ThemeProvider({ children, theme, mode }: ThemeProviderProps) {
  useEffect(() => {
    if (theme) document.documentElement.setAttribute('data-theme', theme);
    else document.documentElement.removeAttribute('data-theme');
    return () => {
      document.documentElement.removeAttribute('data-theme');
    };
  }, [theme]);

  useEffect(() => {
    if (mode) document.documentElement.setAttribute('data-mode', mode);
    else document.documentElement.removeAttribute('data-mode');
    return () => {
      document.documentElement.removeAttribute('data-mode');
    };
  }, [mode]);

  return <>{children}</>;
}
