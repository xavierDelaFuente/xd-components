import {
  type ElementType,
  type ForwardedRef,
  forwardRef,
  type ReactNode,
  useCallback,
  useState,
} from 'react';
import type { OverridableProps } from './types';

export interface UnstyledButtonRenderState {
  isHovered: boolean;
  isPressed: boolean;
  isFocused: boolean;
  isFocusVisible: boolean;
  isDisabled: boolean;
}

export interface UnstyledButtonOwnProps<T extends ElementType = ElementType> {
  as?: T;
  children?: ReactNode | ((state: UnstyledButtonRenderState) => ReactNode);
  disabled?: boolean;
}

function UnstyledButtonInner<T extends ElementType = 'button'>(
  { as, children, disabled = false, ...restProps }: UnstyledButtonProps<T>,
  ref: ForwardedRef<Element>,
) {
  const Component = (as || 'button') as ElementType;

  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isFocusVisible, setIsFocusVisible] = useState(false);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setIsPressed(false);
  }, []);
  const handleMouseDown = useCallback(() => setIsPressed(true), []);
  const handleMouseUp = useCallback(() => setIsPressed(false), []);

  const handleFocus = useCallback((e: React.FocusEvent) => {
    setIsFocused(true);
    if (e.target.matches(':focus-visible')) {
      setIsFocusVisible(true);
    }
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    setIsFocusVisible(false);
  }, []);

  const state: UnstyledButtonRenderState = {
    isHovered,
    isPressed,
    isFocused,
    isFocusVisible,
    isDisabled: disabled,
  };

  const resolvedChildren =
    typeof children === 'function' ? children(state) : children;

  return (
    <Component
      ref={ref}
      type={Component === 'button' ? 'button' : undefined}
      disabled={disabled}
      data-hovered={isHovered || undefined}
      data-pressed={isPressed || undefined}
      data-focused={isFocused || undefined}
      data-focus-visible={isFocusVisible || undefined}
      data-disabled={disabled || undefined}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...restProps}
    >
      {resolvedChildren}
    </Component>
  );
}

export type UnstyledButtonProps<T extends ElementType = 'button'> =
  OverridableProps<T, UnstyledButtonOwnProps<T>>;

export const UnstyledButton = forwardRef(UnstyledButtonInner) as <
  T extends ElementType = 'button',
>(
  props: UnstyledButtonProps<T> & { ref?: ForwardedRef<Element> },
) => React.ReactElement;
