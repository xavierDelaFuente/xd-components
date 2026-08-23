import { type ForwardedRef, forwardRef, useState } from 'react';

export type UnstyledRadioProps = {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  invalid?: boolean;
} & Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type' | 'checked' | 'defaultChecked' | 'onChange' | 'disabled' | 'invalid'
>;

function booleanToString(value: boolean | undefined): string | undefined {
  return value ? 'true' : undefined;
}

function UnstyledRadioInner(
  {
    checked,
    defaultChecked,
    onChange,
    disabled,
    invalid,
    onFocus,
    onBlur,
    ...rest
  }: UnstyledRadioProps,
  ref: ForwardedRef<HTMLInputElement>,
) {
  const isControlled = checked !== undefined;
  const [internalChecked, setInternalChecked] = useState(
    defaultChecked ?? false,
  );
  const isChecked = isControlled ? checked : internalChecked;

  const [focused, setFocused] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) {
      setInternalChecked(e.target.checked);
    }
    onChange?.(e);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    onBlur?.(e);
  };

  return (
    <input
      ref={ref}
      {...rest}
      type="radio"
      checked={isControlled ? isChecked : undefined}
      defaultChecked={isControlled ? undefined : defaultChecked}
      onChange={handleChange}
      data-checked={booleanToString(isChecked)}
      onFocus={handleFocus}
      onBlur={handleBlur}
      data-focused={booleanToString(focused)}
      disabled={disabled}
      data-disabled={booleanToString(disabled)}
      data-invalid={booleanToString(invalid)}
      aria-invalid={invalid ? 'true' : undefined}
    />
  );
}

export const UnstyledRadio = forwardRef<HTMLInputElement, UnstyledRadioProps>(
  UnstyledRadioInner,
);
