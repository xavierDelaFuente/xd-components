import { FormFieldProvider } from '@asnewyla/input';
import {
  type ComponentPropsWithoutRef,
  type ForwardedRef,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { flushSync } from 'react-dom';
import { FormErrorSummary } from './FormErrorSummary';
import { type InvalidField, useFieldRegistry } from './useFieldRegistry';

export type FormProps = Omit<ComponentPropsWithoutRef<'form'>, 'onSubmit'> & {
  children: React.ReactNode;
  onSubmit?: (values: Record<string, string>) => void;
};

function FormInner(
  { children, onSubmit, noValidate = true, ...restProps }: FormProps,
  ref: ForwardedRef<HTMLFormElement>,
) {
  const formRef = useRef<HTMLFormElement>(null);
  useImperativeHandle(ref, () => formRef.current as HTMLFormElement);
  const summaryRef = useRef<HTMLDivElement>(null);
  const {
    errors,
    registerField,
    unregisterField,
    validateField,
    fieldNames,
    invalidFields,
  } = useFieldRegistry(formRef);

  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    let hasError = false;
    // flushSync commits the validation state synchronously, so the
    // summary is already in the DOM by the time we call .focus() below.
    flushSync(() => {
      for (const name of fieldNames()) {
        if (validateField(name)) hasError = true;
      }
      setHasAttemptedSubmit(true);
    });
    if (hasError) {
      event.preventDefault();
      summaryRef.current?.focus();
      return;
    }

    if (!onSubmit) return;
    // With an action, the native submit (or a React 19 form action) goes ahead.
    if (restProps.action === undefined) event.preventDefault();

    const values: Record<string, string> = {};
    for (const [key, value] of new FormData(event.currentTarget).entries()) {
      values[key] = String(value);
    }
    onSubmit(values);
  }

  const invalid: InvalidField[] = hasAttemptedSubmit ? invalidFields() : [];

  const contextValue = useMemo(
    () => ({ registerField, unregisterField, validateField, errors }),
    [registerField, unregisterField, validateField, errors],
  );

  return (
    <form
      {...restProps}
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate={noValidate}
    >
      {invalid.length > 0 && (
        <FormErrorSummary ref={summaryRef} invalidFields={invalid} />
      )}
      <FormFieldProvider value={contextValue}>{children}</FormFieldProvider>
    </form>
  );
}

export const Form = forwardRef(FormInner);
