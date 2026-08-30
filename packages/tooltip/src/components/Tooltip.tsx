import {
  Tooltip as UnstyledTooltip,
  type TooltipProps as UnstyledTooltipProps,
} from '@asnewyla/unstyled-tooltip';
import { type ForwardedRef, forwardRef } from 'react';
import './Tooltip.css';

export type TooltipProps = UnstyledTooltipProps;

function TooltipInner(
  { className, ...rest }: TooltipProps,
  ref: ForwardedRef<HTMLSpanElement>,
) {
  return (
    <UnstyledTooltip
      {...rest}
      className={className ? `xd-tooltip-root ${className}` : 'xd-tooltip-root'}
      ref={ref}
    />
  );
}

export const Tooltip = forwardRef<HTMLSpanElement, TooltipProps>(TooltipInner);
