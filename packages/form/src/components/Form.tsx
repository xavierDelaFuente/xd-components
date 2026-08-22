import { FormFieldProvider } from '@asnewyla/input';
import { forwardRef, useMemo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { type InvalidField, useFieldRegistry } from './useFieldRegistry';

export type FormProps = {
  children: React.ReactNode;
  onSubmit: (values: Record<string, string>) => void;
};

export function Form({ children, onSubmit }: FormProps) {
  const formRef = useRef<HTMLFormElement>(null);
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
    event.preventDefault();

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
      summaryRef.current?.focus();
      return;
    }

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
    <form ref={formRef} onSubmit={handleSubmit} noValidate>
      {invalid.length > 0 && (
        <ErrorSummary ref={summaryRef} invalidFields={invalid} />
      )}
      <FormFieldProvider value={contextValue}>{children}</FormFieldProvider>
    </form>
  );
}

type ErrorSummaryProps = {
  invalidFields: InvalidField[];
};

const ErrorSummary = forwardRef<HTMLDivElement, ErrorSummaryProps>(
  function ErrorSummary({ invalidFields }, ref) {
    return (
      <div
        className="xd-form-error-summary"
        role="alert"
        tabIndex={-1}
        ref={ref}
      >
        <p className="xd-form-error-summary-heading">There is a problem</p>
        <ul>
          {invalidFields.map(({ name, id, message }) => (
            <li key={name}>
              <a
                href={`#${id}`}
                onClick={(event) => {
                  event.preventDefault();
                  document.getElementById(id)?.focus();
                }}
              >
                {message}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  },
);
