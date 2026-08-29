import { type ForwardedRef, forwardRef, useState } from 'react';

export type UnstyledTextareaProps = {
  defaultValue?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
  invalid?: boolean;
} & Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  'defaultValue' | 'value' | 'onChange' | 'disabled' | 'invalid'
>;

function booleanToString(value: boolean | undefined): string | undefined {
  return value ? 'true' : undefined;
}

function UnstyledTextareaInner(
  {
    defaultValue,
    value,
    onChange,
    disabled,
    invalid,
    onFocus,
    onBlur,
    ...rest
  }: UnstyledTextareaProps,
  ref: ForwardedRef<HTMLTextAreaElement>,
) {
  const [focused, setFocused] = useState(false);

  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setFocused(false);
    onBlur?.(e);
  };

  return (
    <textarea
      {...rest}
      ref={ref}
      defaultValue={defaultValue}
      value={value}
      onChange={onChange}
      data-focused={booleanToString(focused)}
      onFocus={handleFocus}
      onBlur={handleBlur}
      disabled={disabled}
      data-disabled={booleanToString(disabled)}
      data-invalid={booleanToString(invalid)}
      aria-invalid={invalid ? 'true' : undefined}
    />
  );
}

export const UnstyledTextarea = forwardRef<
  HTMLTextAreaElement,
  UnstyledTextareaProps
>(UnstyledTextareaInner);
