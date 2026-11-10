import type { ButtonSize } from '@asnewyla/button';
import {
  type ComponentPropsWithoutRef,
  type ForwardedRef,
  forwardRef,
  type ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { ToggleGroupProvider } from './ToggleGroupContext';
import './ToggleGroup.css';

type AccessibleName =
  | { 'aria-label': string; 'aria-labelledby'?: string }
  | { 'aria-label'?: string; 'aria-labelledby': string };

export type ToggleGroupProps = Omit<
  ComponentPropsWithoutRef<'div'>,
  'role' | 'aria-label' | 'aria-labelledby' | 'defaultValue'
> &
  AccessibleName & {
    children: ReactNode;
    /** Native `name` given to every item, so a submit item sends `name=value`. */
    name?: string;
    /**
     * The pressed item's value. With `onValueChange`, a controlled group.
     * Without it, a server-driven one: clicks don't move the pressed state.
     */
    value?: string;
    /** The initially pressed item's value, for an uncontrolled group. */
    defaultValue?: string;
    /** Called with the clicked item's value when it isn't already pressed. */
    onValueChange?: (value: string) => void;
    size?: ButtonSize;
    disabled?: boolean;
    /** Space between items, on the same scale as `ButtonGroup` and `Stack`/`Group`. */
    gap?: 'sm' | 'md' | 'lg';
  };

function ToggleGroupInner(
  {
    children,
    name,
    value: valueProp,
    defaultValue,
    onValueChange,
    size,
    disabled,
    gap = 'sm',
    className,
    ...restProps
  }: ToggleGroupProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const isControlled = valueProp !== undefined;
  const value = isControlled ? valueProp : uncontrolledValue;

  const select = useCallback(
    (next: string) => {
      if (next === value) return;
      if (!isControlled) setUncontrolledValue(next);
      onValueChange?.(next);
    },
    [value, isControlled, onValueChange],
  );

  const contextValue = useMemo(
    () => ({ name, size, disabled, value, select }),
    [name, size, disabled, value, select],
  );

  return (
    // biome-ignore lint/a11y/useSemanticElements: role="group" on a div is the WAI-ARIA toggle-button group pattern; <fieldset> brings default browser chrome (see button-group).
    <div
      {...restProps}
      ref={ref}
      role="group"
      data-gap={gap}
      className={className ? `xd-toggle-group ${className}` : 'xd-toggle-group'}
    >
      <ToggleGroupProvider value={contextValue}>{children}</ToggleGroupProvider>
    </div>
  );
}

export const ToggleGroup = forwardRef(ToggleGroupInner);
