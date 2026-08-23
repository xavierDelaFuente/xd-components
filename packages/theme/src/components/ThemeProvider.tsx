import { useEffect } from 'react';

export type ThemeProviderProps = {
  theme: string;
  children: React.ReactNode;
  mode?: string;
};

export function ThemeProvider({ children, theme, mode }: ThemeProviderProps) {
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    return () => {
      document.documentElement.removeAttribute('data-theme');
    };
  }, [theme]);

  useEffect(() => {
    if (mode) document.documentElement.setAttribute('data-mode', mode)
    else document.documentElement.removeAttribute('data-mode')
    return () => {
      document.documentElement.removeAttribute('data-mode');
    };
  }, [mode]);

  return <>{children}</>;
}
