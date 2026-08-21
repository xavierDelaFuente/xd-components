import {
  UnstyledInput,
  type UnstyledInputProps,
} from '@asnewyla/unstyled-input';
import { type ForwardedRef, forwardRef, useId } from 'react';
import './Input.css';

export type InputProps = Omit<UnstyledInputProps, 'invalid'> & {
  label: string;
  error?: string;
};

function InputInner(
  { label, id, error, disabled, className, ...rest }: InputProps,
  ref: ForwardedRef<HTMLInputElement>,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;

  return (
    <div className="xd-input">
      <label className="xd-input-label" htmlFor={inputId}>
        {label}
      </label>
      <UnstyledInput
        id={inputId}
        {...rest}
        invalid={!!error}
        disabled={disabled}
        aria-describedby={error ? errorId : undefined}
        className={['xd-input-field', className].filter(Boolean).join(' ')}
        ref={ref}
      />
      {error && (
        <div className="xd-input-error" id={errorId}>
          {error}
        </div>
      )}
    </div>
  );
}

export const Input = forwardRef<HTMLInputElement, InputProps>(InputInner);
