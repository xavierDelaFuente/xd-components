import {
  TabPanel as UnstyledTabPanel,
  type TabPanelProps as UnstyledTabPanelProps,
} from '@asnewyla/unstyled-tabs';
import { type ForwardedRef, forwardRef } from 'react';

export type TabPanelProps = UnstyledTabPanelProps;

function TabPanelInner(
  { className, ...rest }: TabPanelProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <UnstyledTabPanel
      {...rest}
      className={className ? `xd-tab-panel ${className}` : 'xd-tab-panel'}
      ref={ref}
    />
  );
}

export const TabPanel = forwardRef<HTMLDivElement, TabPanelProps>(
  TabPanelInner,
);
