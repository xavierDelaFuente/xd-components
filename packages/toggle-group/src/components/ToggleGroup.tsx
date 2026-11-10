import type { ButtonSize } from '@asnewyla/button';
import {
  type ComponentPropsWithoutRef,
  type ForwardedRef,
  forwardRef,
  type ReactNode,
  useMemo,
} from 'react';
import { ToggleGroupProvider } from './ToggleGroupContext';
import './ToggleGroup.css';

type AccessibleName =
  | { 'aria-label': string; 'aria-labelledby'?: string }
  | { 'aria-label'?: string; 'aria-labelledby': string };

export type ToggleGroupProps = Omit<
  ComponentPropsWithoutRef<'div'>,
  'role' | 'aria-label' | 'aria-labelledby'
> &
  AccessibleName & {
    children: ReactNode;
    /** Native `name` given to every item, so a submit item sends `name=value`. */
    name?: string;
    size?: ButtonSize;
    disabled?: boolean;
  };

function ToggleGroupInner(
  { children, name, size, disabled, className, ...restProps }: ToggleGroupProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const contextValue = useMemo(
    () => ({ name, size, disabled }),
    [name, size, disabled],
  );

  return (
    // biome-ignore lint/a11y/useSemanticElements: role="group" on a div is the WAI-ARIA toggle-button group pattern; <fieldset> brings default browser chrome (see button-group).
    <div
      {...restProps}
      ref={ref}
      role="group"
      className={className ? `xd-toggle-group ${className}` : 'xd-toggle-group'}
    >
      <ToggleGroupProvider value={contextValue}>{children}</ToggleGroupProvider>
    </div>
  );
}

export const ToggleGroup = forwardRef(ToggleGroupInner);
