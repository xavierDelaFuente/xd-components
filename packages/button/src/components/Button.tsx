import {
  type ElementType,
  type ForwardedRef,
  type ReactNode,
  forwardRef,
} from 'react';
import { UnstyledButton } from '@xd/unstyled-button';
import type { OverridableProps } from './types';
import './Button.css';

export type ButtonVariant = 'primary' | 'secondary' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonOwnProps<T extends ElementType = 'button'> {
  as?: T;
  children?: ReactNode;
  disabled?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
}

export type ButtonProps<T extends ElementType = 'button'> = OverridableProps<
  T,
  ButtonOwnProps<T>
>;

function ButtonInner<T extends ElementType = 'button'>(
  {
    as,
    children,
    disabled = false,
    variant = 'primary',
    size = 'md',
    startIcon,
    endIcon,
    className,
    ...restProps
  }: ButtonProps<T>,
  ref: ForwardedRef<Element>,
) {
  return (
    <UnstyledButton
      as={as as ElementType | undefined}
      ref={ref}
      disabled={disabled}
      data-variant={variant}
      data-size={size}
      className={['xd-button', className].filter(Boolean).join(' ')}
      {...(restProps as Record<string, unknown>)}
    >
      {startIcon && (
        <span aria-hidden="true" data-slot="icon">
          {startIcon}
        </span>
      )}
      {children}
      {endIcon && (
        <span aria-hidden="true" data-slot="icon">
          {endIcon}
        </span>
      )}
    </UnstyledButton>
  );
}

export const Button = forwardRef(ButtonInner) as <
  T extends ElementType = 'button',
>(
  props: ButtonProps<T> & { ref?: ForwardedRef<Element> },
) => React.ReactElement;
