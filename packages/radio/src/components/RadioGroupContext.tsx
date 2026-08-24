import { createContext, useContext } from 'react';

export interface RadioGroupContextValue {
  name: string;
  value: string | undefined;
  onChange: (value: string) => void;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export const RadioGroupProvider = RadioGroupContext.Provider;

export function useRadioGroupContext(): RadioGroupContextValue | null {
  return useContext(RadioGroupContext);
}
