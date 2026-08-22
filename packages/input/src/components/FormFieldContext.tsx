import { createContext, type RefObject, useContext } from 'react';

export interface ValidationRules {
  required?: boolean | string;
  // string, not RegExp — matches the native <input pattern> attribute,
  // which is the regex source text, not a RegExp object. Form constructs
  // `new RegExp(pattern)` itself at validation time.
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  // string | number, matching the native <input min>/<input max> attributes
  // (also used for date/time inputs, where the value is a string).
  min?: string | number;
  max?: string | number;
  validate?: (value: string) => string | undefined;
}

export interface FieldRegistration {
  ref: RefObject<HTMLInputElement>;
  rules?: ValidationRules;
}

export interface FormFieldContextValue {
  registerField: (name: string, registration: FieldRegistration) => void;
  unregisterField: (name: string) => void;
  validateField: (name: string) => void;
  errors: Record<string, string | undefined>;
}

const FormFieldContext = createContext<FormFieldContextValue | null>(null);

export const FormFieldProvider = FormFieldContext.Provider;

export function useFormFieldContext(): FormFieldContextValue | null {
  return useContext(FormFieldContext);
}
