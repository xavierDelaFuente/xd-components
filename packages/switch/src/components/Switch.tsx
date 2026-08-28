import {
  UnstyledSwitch,
  type UnstyledSwitchProps,
} from '@asnewyla/unstyled-switch';
import { type ForwardedRef, forwardRef, useId } from 'react';
import './Switch.css';

export type SwitchProps = Omit<UnstyledSwitchProps, 'invalid'> & {
  label: string;
  error?: string;
};

function SwitchInner(
  { label, id, error, disabled, className, ...rest }: SwitchProps,
  ref: ForwardedRef<HTMLInputElement>,
) {
  const generatedId = useId();
  const switchId = id ?? generatedId;
  const errorId = `${switchId}-error`;

  return (
    <div className="xd-switch">
      <UnstyledSwitch
        id={switchId}
        {...rest}
        invalid={!!error}
        disabled={disabled}
        aria-describedby={error ? errorId : undefined}
        className={
          className ? `xd-switch-input ${className}` : 'xd-switch-input'
        }
        ref={ref}
      />
      <label className="xd-switch-label" htmlFor={switchId}>
        {label}
      </label>
      {error && (
        <div className="xd-switch-error" id={errorId}>
          {error}
        </div>
      )}
    </div>
  );
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(SwitchInner);
