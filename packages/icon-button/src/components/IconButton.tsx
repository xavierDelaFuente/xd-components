import { Button } from '@xd/button';

export type IconButtonProps = {
  label: string;
  icon: React.ReactNode;
};

export function IconButton({ label, icon }: IconButtonProps) {
  return <Button startIcon={icon} aria-label={label} />;
}
