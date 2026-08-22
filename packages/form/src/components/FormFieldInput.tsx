import {
  Input,
  type InputProps,
  type ValidationRules,
  useFormFieldContext,
} from '@asnewyla/input';
import { type ForwardedRef, forwardRef, useEffect, useRef } from 'react';

export type FormFieldInputProps = Omit<InputProps, 'name'> & {
  name: string;
  validate?: (value: string) => string | undefined;
};

function FormFieldInputInner(
  {
    name,
    required,
    pattern,
    minLength,
    maxLength,
    min,
    max,
    validate,
    error,
    onBlur,
    ...rest
  }: FormFieldInputProps,
  ref: ForwardedRef<HTMLInputElement>,
) {
  // useFormFieldContext() returns null when there's no ancestor
  // FormFieldProvider — that's what makes FormFieldInput a no-op outside a
  // Form (still a perfectly usable Input, just without registration).
  const formField = useFormFieldContext();

  // A stable ref we always own, so registerField always gets a real node —
  // separate from `ref`, which is whatever (or nothing) the consumer passed.
  const inputRef = useRef<HTMLInputElement | null>(null);

  const rules: ValidationRules = {
    required,
    pattern,
    minLength,
    maxLength,
    min,
    max,
    validate,
  };

  // Deliberately depends on formField?.registerField/unregisterField, not
  // on `formField` itself — Form's context value changes identity whenever
  // its `errors` state updates (that's correct: this component needs to
  // re-render to read the new error). But if this effect depended on the
  // whole object, every validation would also re-trigger registration:
  // cleanup would call the *previous* render's unregisterField, deleting
  // the field and wiping the error validateField just set, in the same
  // tick it was written. Depending on the two functions directly (stable
  // via Form's useCallback) keeps registration decoupled from errors
  // changing.
  // Also deliberately not depending on `rules` — it's a fresh object every
  // render, so registration happens once per mount (or when formField/name
  // change), not on every rule-prop tweak. Rule props are effectively fixed
  // at mount for v0.x; no test or use case yet needs them reactive.
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally narrowed deps — see comment above
  useEffect(() => {
    if (!formField) return;
    formField.registerField(name, { ref: inputRef, rules });
    return () => formField.unregisterField(name);
  }, [formField?.registerField, formField?.unregisterField, name]);

  // Merges `inputRef` (ours, for registration) with `ref` (the consumer's
  // forwarded one, if any) so both end up pointing at the same DOM node —
  // neither one silently loses the element to the other.
  const setRefs = (node: HTMLInputElement | null) => {
    inputRef.current = node;
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  };

  function handleBlur(event: React.FocusEvent<HTMLInputElement>) {
    if (formField) {
      formField.validateField(name);
    }
    onBlur?.(event);
  }

  const formContextError = formField ? formField.errors[name] : undefined;
  const formFieldError = error ?? formContextError;

  return (
    <Input
      name={name}
      required={required}
      pattern={pattern}
      minLength={minLength}
      maxLength={maxLength}
      min={min}
      max={max}
      {...rest}
      error={formFieldError}
      onBlur={handleBlur}
      ref={setRefs}
    />
  );
}

export const FormFieldInput = forwardRef<HTMLInputElement, FormFieldInputProps>(
  FormFieldInputInner,
);
