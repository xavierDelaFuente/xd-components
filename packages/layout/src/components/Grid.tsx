import { type ForwardedRef, forwardRef } from 'react';

export type GridProps = {
  children?: React.ReactNode;
  columns?: number | string;
  style?: React.CSSProperties;
  'data-testid'?: string;
  gap?: 'sm' | 'md' | 'lg';
  align?: 'start' | 'center' | 'end';
  justify?: 'start' | 'center' | 'end';
  className?: string;
};
function GridInner(
  {
    children,
    columns,
    style,
    'data-testid': dataTestId,
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
      data-testid={dataTestId}
      data-gap={gap}
      data-align={align}
      data-justify={justify}
      className={className ? `xd-grid ${className}` : 'xd-grid'}
      ref={ref}
      style={{ display: 'grid', gridTemplateColumns: columnsStyle, ...style }}
      {...rest}
    >
      {children}
    </div>
  );
}

export const Grid = forwardRef<HTMLDivElement, GridProps>(GridInner);
