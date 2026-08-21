import {
  UnstyledInput,
  type UnstyledInputProps,
} from '@asnewyla/unstyled-input';
import { type ForwardedRef, forwardRef, useId } from 'react';

export type InputProps = Omit<UnstyledInputProps, 'invalid'> & {
  label: string;
  error?: string;
};

function InputInner(
  { label, id, error, disabled, ...rest }: InputProps,
  ref: ForwardedRef<HTMLInputElement>,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;

  return (
    <>
      <label htmlFor={inputId}>{label}</label>
      <UnstyledInput
        id={inputId}
        {...rest}
        invalid={!!error}
        disabled={disabled}
        aria-describedby={error ? errorId : undefined}
        ref={ref}
      />
      {error && <div id={errorId}>{error}</div>}
    </>
  );
}

export const Input = forwardRef<HTMLInputElement, InputProps>(InputInner);
