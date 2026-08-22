import { FormFieldProvider } from '@asnewyla/input';
import { useMemo, useRef } from 'react';
import { useFieldRegistry } from './useFieldRegistry';

export type FormProps = {
  children: React.ReactNode;
  onSubmit: (values: Record<string, string>) => void;
};

export function Form({ children, onSubmit }: FormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const { errors, registerField, unregisterField, validateField, fieldNames } =
    useFieldRegistry(formRef);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    let hasError = false;
    for (const name of fieldNames()) {
      if (validateField(name)) hasError = true;
    }
    if (hasError) return;

    const values: Record<string, string> = {};
    for (const [key, value] of new FormData(event.currentTarget).entries()) {
      values[key] = String(value);
    }
    onSubmit(values);
  }

  // Memoized so this object's identity only changes when `errors` actually
  // changes — registerField/unregisterField/validateField are already
  // stable via useCallback (inside useFieldRegistry). Without this, Input's
  // registration effect (which depends on this whole object) would re-fire
  // on every render, unregistering and re-registering the field on every
  // validation.
  const contextValue = useMemo(
    () => ({ registerField, unregisterField, validateField, errors }),
    [registerField, unregisterField, validateField, errors],
  );

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <FormFieldProvider value={contextValue}>{children}</FormFieldProvider>
    </form>
  );
}
