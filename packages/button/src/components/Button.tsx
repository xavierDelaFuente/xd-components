import type { ComponentPropsWithoutRef } from 'react';
import { UnstyledButton } from '@xd/unstyled-button';

export type ButtonOwnProps = {
    children?: React.ReactNode;
    disabled?: boolean;
    variant?: 'primary' | 'secondary' | 'destructive';
    size?: 'sm' | 'md' | 'lg';
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
};

export type ButtonProps = ButtonOwnProps &
    Omit<ComponentPropsWithoutRef<'button'>, keyof ButtonOwnProps>;

export function Button({
    children,
    disabled = false,
    variant = 'primary',
    size = 'md',
    startIcon,
    endIcon,

    ...restProps
}: ButtonProps) {
    return (
        <UnstyledButton
            disabled={disabled}
            data-variant={variant}
            data-size={size}
            {...restProps}
        >
            {startIcon && <>{startIcon}</>}
            {children}
            {endIcon && <>{endIcon}</>}
        </UnstyledButton>
    );
}
