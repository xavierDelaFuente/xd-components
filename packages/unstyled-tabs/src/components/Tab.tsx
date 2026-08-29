import {
  type ComponentPropsWithoutRef,
  type ForwardedRef,
  forwardRef,
  type MouseEvent,
} from 'react';
import { getPanelId, getTabId, useTabsContext } from './TabsContext';

export type TabProps = {
  value: string;
  disabled?: boolean;
} & Omit<
  ComponentPropsWithoutRef<'button'>,
  'value' | 'role' | 'type' | 'disabled'
>;

function TabInner(
  { value, disabled, onClick, ...rest }: TabProps,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  const { baseId, activeValue, setActiveValue } = useTabsContext();
  const isActive = activeValue === value;

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      setActiveValue(value);
    }
    onClick?.(e);
  };

  return (
    <button
      {...rest}
      ref={ref}
      type="button"
      role="tab"
      id={getTabId(baseId, value)}
      aria-controls={getPanelId(baseId, value)}
      aria-selected={isActive ? 'true' : 'false'}
      tabIndex={isActive ? 0 : -1}
      disabled={disabled}
      data-tab-value={value}
      onClick={handleClick}
    />
  );
}

export const Tab = forwardRef<HTMLButtonElement, TabProps>(TabInner);
