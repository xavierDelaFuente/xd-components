import { type ForwardedRef, forwardRef, type HTMLAttributes } from 'react';

export type LayoutProps = {
  className?: string;
  children: React.ReactNode;
  'data-testid'?: string;
  direction?: 'horizontal' | 'vertical';
  gap?: 'sm' | 'md' | 'lg';
  align?: 'start' | 'center' | 'end';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  wrap?: boolean | 'wrap' | 'nowrap';
} & Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'children'>;

function LayoutInner(
  {
    children,
    className,
    'data-testid': dataTestId = 'layout',
    direction = 'vertical',
    gap,
    align,
    justify,
    wrap,
    ...restProps
  }: LayoutProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <div
      ref={ref}
      data-testid={dataTestId}
      data-direction={direction}
      data-gap={gap}
      data-align={align}
      data-justify={justify}
      data-wrap={wrap === true || wrap === 'wrap' ? 'true' : undefined}
      className={['xd-layout', className].filter(Boolean).join(' ')}
      {...restProps}
    >
      {children}
    </div>
  );
}

export const Layout = forwardRef(LayoutInner);
