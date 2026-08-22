import type { ValidationRules } from '@asnewyla/input';
import { type RefObject, useCallback, useRef, useState } from 'react';
import { validateValue } from './validation';

interface FieldEntry {
  rules?: ValidationRules;
}

export interface FieldRegistry {
  errors: Record<string, string | undefined>;
  registerField: (
    name: string,
    registration: { rules?: ValidationRules },
  ) => void;
  unregisterField: (name: string) => void;
  validateField: (name: string) => string | undefined;
  fieldNames: () => string[];
}

// Owns everything about tracking and validating fields — registration,
// error state, and reading a field's current value off the DOM. Form.tsx
// only needs to consume this and handle submit-specific orchestration
// (looping fields, gathering FormData for onSubmit).
export function useFieldRegistry(
  formRef: RefObject<HTMLFormElement>,
): FieldRegistry {
  const fieldsRef = useRef<Map<string, FieldEntry>>(new Map());
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  const registerField = useCallback(
    (name: string, registration: { rules?: ValidationRules }) => {
      fieldsRef.current.set(name, { rules: registration.rules });
    },
    [],
  );

  const unregisterField = useCallback((name: string) => {
    fieldsRef.current.delete(name);
    setErrors((prev) => {
      if (!(name in prev)) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }, []);

  // Reads straight off the DOM via FormData rather than tracking value in
  // state — Input already sets a native `name` attribute, so there's no
  // need to duplicate that as React state here.
  const getFieldValue = useCallback(
    (name: string): string => {
      if (!formRef.current) return '';
      return String(new FormData(formRef.current).get(name) ?? '');
    },
    [formRef],
  );

  const validateField = useCallback(
    (name: string) => {
      const field = fieldsRef.current.get(name);
      const error = validateValue(getFieldValue(name), field?.rules);
      setErrors((prev) => ({ ...prev, [name]: error }));
      return error;
    },
    [getFieldValue],
  );

  const fieldNames = useCallback(
    () => Array.from(fieldsRef.current.keys()),
    [],
  );

  return {
    errors,
    registerField,
    unregisterField,
    validateField,
    fieldNames,
  };
}
