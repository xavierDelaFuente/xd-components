import { useEffect } from 'react';

export type ThemeProviderProps = {
  theme: string;
  children: React.ReactNode;
};

export function ThemeProvider({ children, theme }: ThemeProviderProps) {
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    return () => {
      document.documentElement.removeAttribute('data-theme');
    };
  }, [theme]);

  return <>{children}</>;
}