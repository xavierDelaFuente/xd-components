import type { ButtonSize } from '@asnewyla/button';
import { createContext, useContext } from 'react';

export interface ToggleGroupContextValue {
  name?: string;
  size?: ButtonSize;
  disabled?: boolean;
  /** The pressed item's value, if any. */
  value?: string;
  /** Called by an item when it's clicked. */
  select: (value: string) => void;
}

const ToggleGroupContext = createContext<ToggleGroupContextValue | null>(null);

export const ToggleGroupProvider = ToggleGroupContext.Provider;

export function useToggleGroupContext(): ToggleGroupContextValue | null {
  return useContext(ToggleGroupContext);
}
