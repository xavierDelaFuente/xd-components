import {
  TabList as UnstyledTabList,
  type TabListProps as UnstyledTabListProps,
} from '@asnewyla/unstyled-tabs';
import { type ForwardedRef, forwardRef } from 'react';

export type TabListProps = UnstyledTabListProps;

function TabListInner(
  { className, ...rest }: TabListProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <UnstyledTabList
      {...rest}
      className={className ? `xd-tab-list ${className}` : 'xd-tab-list'}
      ref={ref}
    />
  );
}

export const TabList = forwardRef<HTMLDivElement, TabListProps>(TabListInner);
