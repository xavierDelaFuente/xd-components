import {
  Tabs as UnstyledTabs,
  type TabsProps as UnstyledTabsProps,
} from '@asnewyla/unstyled-tabs';
import { type ForwardedRef, forwardRef } from 'react';
import './Tabs.css';

export type TabsProps = UnstyledTabsProps;

function TabsInner(
  { className, ...rest }: TabsProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <UnstyledTabs
      {...rest}
      className={className ? `xd-tabs ${className}` : 'xd-tabs'}
      ref={ref}
    />
  );
}

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(TabsInner);
