import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ForwardedRef,
  type ReactNode,
} from 'react';
import {
  ButtonGroupProvider,
  type ButtonVariant,
  type ButtonSize,
} from '@asnewyla/button';
import './ButtonGroup.css';

export type ButtonGroupProps = Omit<ComponentPropsWithoutRef<'div'>, 'role'> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  /** Space between buttons, on the same scale as `Stack`/`Group`. */
  gap?: 'sm' | 'md' | 'lg';
  children: ReactNode;
};

function ButtonGroupInner(
  {
    children,
    variant,
    size,
    disabled,
    gap = 'sm',
    className,
    ...restProps
  }: ButtonGroupProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    // biome-ignore lint/a11y/useSemanticElements: role="group" on a div is a correct WAI-ARIA pattern for a button toolbar; <fieldset> is for form-control groupings and carries unwanted default browser chrome.
    <div
      ref={ref}
      role="group"
      {...restProps}
      data-gap={gap}
      className={className ? `xd-button-group ${className}` : 'xd-button-group'}
    >
      <ButtonGroupProvider value={{ variant, size, disabled }}>
        {children}
      </ButtonGroupProvider>
    </div>
  );
}

export const ButtonGroup = forwardRef(ButtonGroupInner);
