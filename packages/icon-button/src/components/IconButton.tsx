import { Button } from '@xd/button';

export type IconButtonProps = {
    label: string;
    icon: React.ReactNode;
    variant: 'primary' | 'secondary' | 'destructive';
    size: 'sm' | 'md' | 'lg';
};

export function IconButton({ label, icon, variant, size }: IconButtonProps) {
    return <Button startIcon={icon} aria-label={label} data-variant={variant} data-size={size} />;
}
