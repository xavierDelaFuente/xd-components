import {
  UnstyledRadio,
  type UnstyledRadioProps,
} from '@asnewyla/unstyled-radio';
import { type ForwardedRef, forwardRef, useId } from 'react';
import { useRadioGroupContext } from './RadioGroupContext';
import './Radio.css';

export type RadioProps = Omit<UnstyledRadioProps, 'invalid'> & {
  label: string;
  error?: string;
};

function RadioInner(
  {
    id,
    label,
    error,
    disabled,
    className,
    checked,
    onChange,
    value,
    name,
    ...rest
  }: RadioProps,
  ref: ForwardedRef<HTMLInputElement>,
) {
  const group = useRadioGroupContext();
  const generatedId = useId();
  const radioId = id ?? generatedId;
  const errorId = `${radioId}-error`;

  // Own `checked` wins if given (same prop ?? group?.x precedence Button
  // uses for ButtonGroupContext); otherwise, inside a RadioGroup, checked
  // is derived from whether this radio's own value matches the group's
  // selected value — that's the group's whole point: one shared source of
  // truth instead of several independently-tracked radios.
  const resolvedChecked =
    checked ?? (group ? group.value === value : undefined);
  const resolvedName = name ?? group?.name;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e);
    if (group && value !== undefined) {
      group.onChange(String(value));
    }
  };

  return (
    <div className="xd-radio">
      <UnstyledRadio
        id={radioId}
        {...rest}
        name={resolvedName}
        value={value}
        checked={resolvedChecked}
        onChange={handleChange}
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
