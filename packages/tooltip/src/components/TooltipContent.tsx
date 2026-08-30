import {
  TooltipContent as UnstyledTooltipContent,
  type TooltipContentProps as UnstyledTooltipContentProps,
} from '@asnewyla/unstyled-tooltip';
import { type ForwardedRef, forwardRef } from 'react';

export type TooltipContentProps = UnstyledTooltipContentProps;

function TooltipContentInner(
  { className, ...rest }: TooltipContentProps,
  ref: ForwardedRef<HTMLSpanElement>,
) {
  return (
    <UnstyledTooltipContent
      {...rest}
      className={className ? `xd-tooltip ${className}` : 'xd-tooltip'}
      ref={ref}
    />
  );
}

export const TooltipContent = forwardRef<HTMLSpanElement, TooltipContentProps>(
  TooltipContentInner,
);
