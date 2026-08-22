import type { FieldRegistration } from '@asnewyla/input';
import { type RefObject, useCallback, useRef, useState } from 'react';
import { validateValue } from './validation';

export interface InvalidField {
  name: string;
  id: string;
  message: string;
}

export interface FieldRegistry {
  errors: Record<string, string | undefined>;
  registerField: (name: string, registration: FieldRegistration) => void;
  unregisterField: (name: string) => void;
  validateField: (name: string) => string | undefined;
  fieldNames: () => string[];
  invalidFields: () => InvalidField[];
}

export function useFieldRegistry(
  formRef: RefObject<HTMLFormElement>,
): FieldRegistry {
  const fieldsRef = useRef<Map<string, FieldRegistration>>(new Map());
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  const registerField = useCallback(
    (name: string, registration: FieldRegistration) => {
      fieldsRef.current.set(name, registration);
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

  const invalidFields = useCallback((): InvalidField[] => {
    const result: InvalidField[] = [];
    for (const [name, message] of Object.entries(errors)) {
      if (!message) continue;
      const id = fieldsRef.current.get(name)?.ref.current?.id;
      if (!id) continue;
      result.push({ name, id, message });
    }
    return result;
  }, [errors]);

  return {
    errors,
    registerField,
    unregisterField,
    validateField,
    fieldNames,
    invalidFields,
  };
}
