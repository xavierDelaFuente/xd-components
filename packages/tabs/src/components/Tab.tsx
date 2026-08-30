import {
  Tab as UnstyledTab,
  type TabProps as UnstyledTabProps,
} from '@asnewyla/unstyled-tabs';
import { type ForwardedRef, forwardRef } from 'react';

export type TabProps = UnstyledTabProps;

function TabInner(
  { className, ...rest }: TabProps,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  return (
    <UnstyledTab
      {...rest}
      className={className ? `xd-tab ${className}` : 'xd-tab'}
      ref={ref}
    />
  );
}

export const Tab = forwardRef<HTMLButtonElement, TabProps>(TabInner);
