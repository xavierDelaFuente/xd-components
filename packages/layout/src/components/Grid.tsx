import { type ForwardedRef, forwardRef, type HTMLAttributes } from 'react';
import './Grid.css';

export type GridProps = {
  className?: string;
  children?: React.ReactNode;
  'data-testid'?: string;
  columns?: number | string;
  gap?: 'sm' | 'md' | 'lg';
  align?: 'start' | 'center' | 'end';
  justify?: 'start' | 'center' | 'end';
} & Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'children'>;

function GridInner(
  {
    children,
    columns,
    style,
    'data-testid': dataTestId = 'grid',
    gap,
    align,
    justify,
    className,
    ...rest
  }: GridProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const columnsStyle =
    typeof columns === 'number' ? `repeat(${columns}, 1fr)` : columns;

  return (
    <div
      ref={ref}
      {...rest}
      data-testid={dataTestId}
      data-gap={gap}
      data-align={align}
      data-justify={justify}
      className={className ? `xd-grid ${className}` : 'xd-grid'}
      style={{ gridTemplateColumns: columnsStyle, ...style }}
    >
      {children}
    </div>
  );
}

export const Grid = forwardRef<HTMLDivElement, GridProps>(GridInner);
