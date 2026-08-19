import { UnstyledButton } from '@xd/unstyled-button';

export type ButtonProps = {
    children?: React.ReactNode;
    disabled?: boolean;
    variant?: 'primary' | 'secondary' | 'destructive';
};

export function Button({ children, disabled = false, variant = 'primary' }: ButtonProps) {
    return (
        <UnstyledButton disabled={disabled} data-variant={variant}>
            {children}
        </UnstyledButton>
    );
}
