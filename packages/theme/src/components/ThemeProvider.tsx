import { useEffect } from 'react';
import type { Mode, Theme } from '../constants';

export type ThemeProviderProps = {
  children: React.ReactNode;
  /** A shipped theme (autocompleted) or the name of your own theme stylesheet. */
  theme?: Theme | (string & {});
  mode?: Mode;
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
