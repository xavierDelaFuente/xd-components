import { ElementType, type ForwardedRef, forwardRef, ReactNode } from 'react';
import { OverridableProps } from './types';

export interface UnstyledButtonOwnProps {
  as?: ElementType;
  children?: ReactNode;
}

export type UnstyledButtonProps<T extends ElementType = 'button'> =
  OverridableProps<T, UnstyledButtonOwnProps>;

function UnstyledButtonInner<T extends ElementType = 'button'>(
  { as, children, ...restProps }: UnstyledButtonProps<T>,
  ref: ForwardedRef<Element>,
) {
  const Component = as || 'button';

  return (
    <Component
      ref={ref}
      type={Component === 'button' ? 'button' : undefined}
      {...restProps}
    >
      {children}
    </Component>
  );
}

export const UnstyledButton = forwardRef(UnstyledButtonInner) as <
  T extends ElementType = 'button',
>(
  props: UnstyledButtonProps<T> & { ref?: ForwardedRef<Element> },
) => React.ReactElement;
