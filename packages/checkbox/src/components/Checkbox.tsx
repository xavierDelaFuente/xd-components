import {
  UnstyledCheckbox,
  type UnstyledCheckboxProps,
} from '@asnewyla/unstyled-checkbox';
import { type ForwardedRef, forwardRef, useId } from 'react';

export type CheckboxProps = Omit<UnstyledCheckboxProps, 'invalid'> & {
  label: string;
  error?: string;
};

function CheckboxInner(
  { label, id, error, disabled, className, ...rest }: CheckboxProps,
  ref: ForwardedRef<HTMLInputElement>,
) {
  const generatedId = useId();
  const checkboxId = id ?? generatedId;
  const errorId = `${checkboxId}-error`;

  return (
    <div className="xd-checkbox">
      <UnstyledCheckbox
        id={checkboxId}
        {...rest}
        invalid={!!error}
        disabled={disabled}
        aria-describedby={error ? errorId : undefined}
        className={
          className ? `xd-checkbox-input ${className}` : 'xd-checkbox-input'
        }
        ref={ref}
      />
      <label className="xd-checkbox-label" htmlFor={checkboxId}>
        {label}
      </label>
      {error && (
        <div className="xd-checkbox-error" id={errorId}>
          {error}
        </div>
      )}
    </div>
  );
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  CheckboxInner,
);
