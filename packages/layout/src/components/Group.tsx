import {
  type ComponentPropsWithoutRef,
  type ForwardedRef,
  forwardRef,
} from 'react';
import { Layout } from './Layout';

export type GroupProps = Omit<
  ComponentPropsWithoutRef<typeof Layout>,
  'direction'
> & {
  children: React.ReactNode;
};

export function GroupInner(
  { children, ...rest }: GroupProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <Layout ref={ref} data-testid="group" {...rest} direction="horizontal">
      {children}
    </Layout>
  );
}

export const Group = forwardRef<HTMLDivElement, GroupProps>(GroupInner);
