import {
  type ComponentPropsWithoutRef,
  type ForwardedRef,
  forwardRef,
} from 'react';
import { Layout } from './Layout';

export type StackProps = Omit<
  ComponentPropsWithoutRef<typeof Layout>,
  'direction'
> & {
  children: React.ReactNode;
};
function StackInner(
  { children, ...rest }: StackProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <Layout data-testid="stack" ref={ref} {...rest} direction="vertical">
      {children}
    </Layout>
  );
}

export const Stack = forwardRef<HTMLDivElement, StackProps>(StackInner);
