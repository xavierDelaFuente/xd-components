import { type ForwardedRef, forwardRef, useState } from 'react';


export type UnstyledInputProps = {
    defaultValue?: string;
    value?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    invalid?: boolean;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'defaultValue' | 'value' | 'onChange' | 'disabled' | 'invalid'>;

function booleanToString(value: boolean | undefined): string | undefined {
    return value ? 'true' : undefined;
}

function UnstyledInputInner(
    {
        defaultValue,
        value,
        onChange,
        disabled,
        invalid,
        onFocus,
        onBlur,
        ...rest
    }: UnstyledInputProps,
    ref: ForwardedRef<HTMLInputElement>,
) {
    const [focused, setFocused] = useState(false);

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
            ref={ref}
            {...rest}
        />
    );
}

export const UnstyledInput = forwardRef<HTMLInputElement, UnstyledInputProps>(
    UnstyledInputInner,
);
