import {
  type ComponentPropsWithoutRef,
  type ForwardedRef,
  forwardRef,
} from 'react';
import { useTooltipContext } from './TooltipContext';

export type TooltipSide = 'top' | 'right' | 'bottom' | 'left';

export type TooltipContentProps = {
  side?: TooltipSide;
} & Omit<ComponentPropsWithoutRef<'span'>, 'role' | 'id'>;

function TooltipContentInner(
  { side = 'top', ...rest }: TooltipContentProps,
  ref: ForwardedRef<HTMLSpanElement>,
) {
  const { open, contentId } = useTooltipContext();

  if (!open) {
    return null;
  }

  return (
    <span {...rest} ref={ref} role="tooltip" id={contentId} data-side={side} />
  );
}

export const TooltipContent = forwardRef<HTMLSpanElement, TooltipContentProps>(
  TooltipContentInner,
);
