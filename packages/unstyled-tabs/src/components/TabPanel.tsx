import {
  type ComponentPropsWithoutRef,
  type ForwardedRef,
  forwardRef,
} from 'react';
import { getPanelId, getTabId, useTabsContext } from './TabsContext';

export type TabPanelProps = {
  value: string;
} & Omit<ComponentPropsWithoutRef<'div'>, 'role'>;

function TabPanelInner(
  { value, ...rest }: TabPanelProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const { baseId, activeValue } = useTabsContext();

  // Inactive panels aren't rendered at all, not just hidden — their
  // content (and any effects it mounts) doesn't exist while inactive.
  if (activeValue !== value) {
    return null;
  }

  return (
    <div
      {...rest}
      ref={ref}
      role="tabpanel"
      id={getPanelId(baseId, value)}
      aria-labelledby={getTabId(baseId, value)}
      // biome-ignore lint/a11y/noNoninteractiveTabindex: role="tabpanel" makes this a real WAI-ARIA interactive landmark, not a plain div
      tabIndex={0}
    />
  );
}

export const TabPanel = forwardRef<HTMLDivElement, TabPanelProps>(
  TabPanelInner,
);
