import { UnstyledButton } from '@xd/unstyled-button';

export type ButtonProps = {
  children?: React.ReactNode;
  disabled?: boolean;
};

export function Button({ children, disabled = false }: ButtonProps) {
  return (
    <UnstyledButton disabled={disabled} data-variant="primary">
      {children}
    </UnstyledButton>
  );
}
