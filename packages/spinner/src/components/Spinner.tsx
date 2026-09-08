import {
  type ComponentPropsWithoutRef,
  type ForwardedRef,
  forwardRef,
  useId,
} from 'react';
import './Spinner.css';

export type SpinnerSize = 'sm' | 'md' | 'lg';

export type SpinnerProps = Omit<
  ComponentPropsWithoutRef<'span'>,
  'children'
> & {
  /** Accessible name announced by assistive tech. Defaults to `'Loading'`. */
  label?: string;
  size?: SpinnerSize;
};

function SpinnerInner(
  { label = 'Loading', size = 'md', className, ...restProps }: SpinnerProps,
  ref: ForwardedRef<HTMLSpanElement>,
) {
  const labelId = `${useId()}-label`;

  return (
    <span
      ref={ref}
      {...restProps}
      role="status"
      aria-labelledby={labelId}
      className={className ? `xd-spinner ${className}` : 'xd-spinner'}
      data-size={size}
    >
      <span className="xd-spinner-indicator" aria-hidden="true" />
      {/* Real text inside the live region — visually hidden, but what a screen
          reader announces on mount and what names the status role. */}
      <span className="xd-spinner-label" id={labelId}>
        {label}
      </span>
    </span>
  );
}

export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(SpinnerInner);
