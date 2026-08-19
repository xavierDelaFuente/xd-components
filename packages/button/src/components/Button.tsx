import { UnstyledButton } from '@xd/unstyled-button';

export type ButtonProps = {
    children?: React.ReactNode;
    disabled?: boolean;
    variant?: 'primary' | 'secondary' | 'destructive';
    size?: 'sm' | 'md' | 'lg';
};

export function Button({ children, disabled = false, variant = 'primary', size = 'md' }: ButtonProps) {
    return (
        <UnstyledButton disabled={disabled} data-variant={variant} data-size={size}>
            {children}
        </UnstyledButton>
    );
}
