import { ForwardedRef, forwardRef, useState } from "react";

export type UnstyledInputProps = {
    defaultValue?: string;
    value?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    invalid?: boolean;
    placeholder?: string;
}
function UnstyledInputInner({ defaultValue, value, onChange, disabled, invalid, placeholder }: UnstyledInputProps, ref: ForwardedRef<HTMLDivElement>,) {
    const [focused, setFocused] = useState(false);

    const onFocus = () => {
        setFocused(true);
    }

    const onBlur = () => {
        setFocused(false);
    }

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
            placeholder={placeholder}
        />
    );
}

export const UnstyledInput = forwardRef<HTMLInputElement, UnstyledInputProps>(UnstyledInputInner);