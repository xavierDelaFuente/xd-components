import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ForwardedRef,
} from 'react';

export type ButtonGroupProps = ComponentPropsWithoutRef<'div'>;

function ButtonGroupInner(
  { children, ...restProps }: ButtonGroupProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    // biome-ignore lint/a11y/useSemanticElements: role="group" on a div is a correct WAI-ARIA pattern for a button toolbar; <fieldset> is for form-control groupings and carries unwanted default browser chrome.
    <div ref={ref} role="group" {...restProps}>
      {children}
    </div>
  );
}

export const ButtonGroup = forwardRef(ButtonGroupInner);
