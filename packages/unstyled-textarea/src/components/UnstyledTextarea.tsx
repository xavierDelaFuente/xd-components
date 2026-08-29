import { ForwardedRef, forwardRef, useState } from "react";

export type UnstyledTextareaProps = {
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
  invalid?: boolean;
}

function booleanToString(value: boolean | undefined): string | undefined {
  return value ? 'true' : undefined;
}


function UnstyledTextareaInner({
  onChange,
  onFocus,
  onBlur,
  disabled,
  invalid,
  ...rest
}: UnstyledTextareaProps,
  ref: ForwardedRef<HTMLTextAreaElement>
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
      role="textbox"
      onChange={onChange}
      data-focused={booleanToString(focused)}
      onFocus={handleFocus}
      onBlur={handleBlur}
      disabled={disabled}
      data-disabled={booleanToString(disabled)}
      data-invalid={booleanToString(invalid)}
      aria-invalid={invalid ? 'true' : undefined}
      ref={ref}
      {...rest}
    />
  )
}

export const UnstyledTextarea = forwardRef(UnstyledTextareaInner)