import { type ForwardedRef, forwardRef, useState } from 'react';


export type UnstyledInputProps = {
    defaultValue?: string;
    value?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    invalid?: boolean;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'defaultValue' | 'value' | 'onChange' | 'disabled' | 'invalid'>;

function UnstyledInputInner(
    {
        defaultValue,
        value,
        onChange,
        disabled,
        invalid,
        ...rest
    }: UnstyledInputProps,
    ref: ForwardedRef<HTMLInputElement>,
) {
    const [focused, setFocused] = useState(false);

    const onFocus = () => {
        setFocused(true);
    };

    const onBlur = () => {
        setFocused(false);
    };

    return (
        <input
            defaultValue={defaultValue}
            value={value}
            onChange={onChange}
            data-focused={focused ? 'true' : undefined}
            onFocus={onFocus}
            onBlur={onBlur}
            disabled={disabled}
            data-disabled={disabled ? 'true' : undefined}
            data-invalid={invalid ? 'true' : undefined}
            aria-invalid={invalid ? 'true' : undefined}
            ref={ref}
            {...rest}
        />
    );
}

export const UnstyledInput = forwardRef<HTMLInputElement, UnstyledInputProps>(
    UnstyledInputInner,
);
