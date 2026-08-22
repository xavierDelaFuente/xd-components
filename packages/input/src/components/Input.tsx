import {
  UnstyledInput,
  type UnstyledInputProps,
} from '@asnewyla/unstyled-input';
import {
  type ForwardedRef,
  forwardRef,
  useEffect,
  useId,
  useRef,
} from 'react';
import { type ValidationRules, useFormFieldContext } from './FormFieldContext';
import './Input.css';

export type InputProps = Omit<UnstyledInputProps, 'invalid'> & {
  label: string;
  error?: string;
  name?: string;
  validate?: (value: string) => string | undefined;
};

function InputInner(
  {
    label,
    id,
    error,
    disabled,
    className,
    name,
    required,
    pattern,
    minLength,
    maxLength,
    min,
    max,
    validate,
    ...rest
  }: InputProps,
  ref: ForwardedRef<HTMLInputElement>,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;

  // useFormFieldContext() returns null when there's no ancestor
  // FormFieldProvider — that's what makes standalone Input a no-op here.
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

  // Deliberately not depending on `rules` below — it's a fresh object every
  // render, so registration happens once per mount (or when formField/name
  // change), not on every rule-prop tweak. Rule props are effectively fixed
  // at mount for v0.x; no test or use case yet needs them reactive.
  // biome-ignore lint/correctness/useExhaustiveDependencies: rules is intentionally captured once at mount, not kept reactive — see comment above
  useEffect(() => {
    if (!formField || !name) return;
    formField.registerField(name, { ref: inputRef, rules });
    return () => formField.unregisterField(name);
  }, [formField, name]);

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

  // function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
  //   if (formField && name) {
  //     formField.
  //   }
  //   if (rest.onChange) {
  //     rest.onChange(event);
  //   }
  // }

  function handleBlur(event: React.FocusEvent<HTMLInputElement>) {
    if (formField && name) {
      formField.validateField(name);
    }
    rest.onBlur?.(event);
  }

  const formContextError = formField && name ? formField.errors[name] : undefined;
  const formFieldError = error ?? formContextError;

  return (
    <div className="xd-input">
      <label className="xd-input-label" htmlFor={inputId}>
        {label}
      </label>
      <UnstyledInput
        id={inputId}
        name={name}
        required={required}
        pattern={pattern}
        minLength={minLength}
        maxLength={maxLength}
        min={min}
        max={max}
        {...rest}
        invalid={!!formFieldError}
        disabled={disabled}
        aria-describedby={formFieldError ? errorId : undefined}
        className={['xd-input-field', className].filter(Boolean).join(' ')}
        ref={setRefs}
        onBlur={handleBlur}
      />
      {formFieldError && (
        <div className="xd-input-error" id={errorId}>
          {formFieldError}
        </div>
      )}
    </div>
  );
}

export const Input = forwardRef<HTMLInputElement, InputProps>(InputInner);
