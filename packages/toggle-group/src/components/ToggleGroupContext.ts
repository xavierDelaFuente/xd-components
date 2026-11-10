import type { ButtonSize } from '@asnewyla/button';
import { createContext, useContext } from 'react';

export interface ToggleGroupContextValue {
  name?: string;
  size?: ButtonSize;
  disabled?: boolean;
}

const ToggleGroupContext = createContext<ToggleGroupContextValue | null>(null);

export const ToggleGroupProvider = ToggleGroupContext.Provider;

export function useToggleGroupContext(): ToggleGroupContextValue | null {
  return useContext(ToggleGroupContext);
}
