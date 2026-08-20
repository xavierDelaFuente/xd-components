import { forwardRef, type ForwardedRef, type ReactNode } from 'react';
import { Button, type ButtonProps } from '@xd/button';

export type IconButtonProps = Omit<
  ButtonProps,
  'children' | 'startIcon' | 'endIcon' | 'as'
> & {
  icon: ReactNode;
  label: string;
};

function IconButtonInner(
  { icon, label, ...restProps }: IconButtonProps,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  return (
    <Button
      ref={ref as ForwardedRef<Element>}
      startIcon={icon}
      aria-label={label}
      {...restProps}
    />
  );
}

export const IconButton = forwardRef(IconButtonInner);
