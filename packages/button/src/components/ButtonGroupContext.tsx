import { createContext, useContext } from 'react';
import type { ButtonVariant, ButtonSize } from './Button';

export interface ButtonGroupContextValue {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
}

const ButtonGroupContext = createContext<ButtonGroupContextValue | null>(null);

export const ButtonGroupProvider = ButtonGroupContext.Provider;

export function useButtonGroupContext(): ButtonGroupContextValue | null {
  return useContext(ButtonGroupContext);
}
