import { type ElementType, type ReactNode } from 'react';
import type { OverridableProps } from './types';

export interface UnstyledButtonOwnProps {
  as?: ElementType;
  children?: ReactNode;
}

export type UnstyledButtonProps<T extends ElementType = 'button'> =
  OverridableProps<T, UnstyledButtonOwnProps>;

export function UnstyledButton<T extends ElementType = 'button'>({
  as,
  children,
  ...restProps
}: UnstyledButtonProps<T>) {
  const Component = as || 'button';

  return (
    <Component
      type={Component === 'button' ? 'button' : undefined}
      {...restProps}
    >
      {children}
    </Component>
  );
}
