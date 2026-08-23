import {
  UnstyledRadio,
  type UnstyledRadioProps,
} from '@asnewyla/unstyled-radio';
import { type ForwardedRef, forwardRef, useId } from 'react';

export type RadioProps = Omit<UnstyledRadioProps, 'invalid'> & {
  label: string;
  error?: string;
};

function RadioInner(
  { id, label, error, disabled, className, ...rest }: RadioProps,
  ref: ForwardedRef<HTMLInputElement>,
) {
  const generatedId = useId();
  const radioId = id ?? generatedId;
  const errorId = `${radioId}-error`;

  return (
    <div className="xd-radio">
      <UnstyledRadio
        id={radioId}
        {...rest}
        invalid={!!error}
        disabled={disabled}
        aria-describedby={error ? errorId : undefined}
        className={className ? `xd-radio-input ${className}` : 'xd-radio-input'}
        ref={ref}
      />
      <label className="xd-radio-label" htmlFor={radioId}>
        {label}
      </label>
      {error && (
        <div className="xd-radio-error" id={errorId}>
          {error}
        </div>
      )}
    </div>
  );
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(RadioInner);
