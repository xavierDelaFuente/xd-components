import {
    type ForwardedRef,
    forwardRef,
    useEffect,
    useRef,
    useState,
} from 'react';

export type UnstyledCheckboxProps = {
    checked?: boolean;
    defaultChecked?: boolean;
    indeterminate?: boolean;
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

function UnstyledCheckboxInner(
    {
        checked,
        defaultChecked,
        indeterminate,
        onChange,
        disabled,
        invalid,
        onFocus,
        onBlur,
        ...rest
    }: UnstyledCheckboxProps,
    ref: ForwardedRef<HTMLInputElement>,
) {
    const isControlled = checked !== undefined;
    const [internalChecked, setInternalChecked] = useState(
        defaultChecked ?? false,
    );
    const isChecked = isControlled ? checked : internalChecked;

    const [focused, setFocused] = useState(false);

    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.indeterminate = indeterminate ?? false;
        }
    }, [indeterminate]);

    const setRefs = (node: HTMLInputElement | null) => {
        inputRef.current = node;
        if (typeof ref === 'function') {
            ref(node);
        } else if (ref) {
            ref.current = node;
        }
    };

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
            ref={setRefs}
            {...rest}
            type="checkbox"
            checked={isChecked}
            onChange={handleChange}
            data-checked={booleanToString(isChecked)}
            data-indeterminate={booleanToString(indeterminate)}
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

export const UnstyledCheckbox = forwardRef<
    HTMLInputElement,
    UnstyledCheckboxProps
>(UnstyledCheckboxInner);
