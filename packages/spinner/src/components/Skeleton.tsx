import {
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ForwardedRef,
  forwardRef,
} from 'react';
import './Skeleton.css';

export type SkeletonRadius = 'sm' | 'md' | 'lg' | 'full';

export type SkeletonProps = Omit<
  ComponentPropsWithoutRef<'span'>,
  'children'
> & {
  /** A number is treated as pixels; a string passes straight through. */
  width?: number | string;
  height?: number | string;
  radius?: SkeletonRadius;
};

const toDimension = (value: number | string | undefined) =>
  typeof value === 'number' ? `${value}px` : value;

function SkeletonInner(
  { width, height, radius, className, style, ...restProps }: SkeletonProps,
  ref: ForwardedRef<HTMLSpanElement>,
) {
  const sizing: CSSProperties = {
    width: toDimension(width),
    height: toDimension(height),
    ...style,
  };

  return (
    <span
      // Decorative by default — the loading state is announced once by a
      // Spinner or an aria-busy container, not by every placeholder box.
      // Spread before {...restProps} so a consumer can opt back in.
      aria-hidden={true}
      {...restProps}
      ref={ref}
      className={className ? `xd-skeleton ${className}` : 'xd-skeleton'}
      data-radius={radius}
      style={sizing}
    />
  );
}

export const Skeleton = forwardRef<HTMLSpanElement, SkeletonProps>(
  SkeletonInner,
);
