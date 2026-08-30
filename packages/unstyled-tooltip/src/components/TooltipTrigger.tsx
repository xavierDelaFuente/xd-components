import {
  Children,
  cloneElement,
  type PointerEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { composeEventHandlers } from './composeEventHandlers';
import { useTooltipContext } from './TooltipContext';

export type TooltipTriggerProps = {
  /** A single focusable element. It is cloned, not wrapped. */
  children: ReactNode;
};

type TriggerChildProps = {
  'aria-describedby'?: string;
  onPointerEnter?: (event: PointerEvent) => void;
  onPointerLeave?: (event: PointerEvent) => void;
  onPointerDown?: (event: PointerEvent) => void;
  onFocus?: (event: React.FocusEvent) => void;
  onBlur?: (event: React.FocusEvent) => void;
};

export function TooltipTrigger({
  children,
}: TooltipTriggerProps): ReactElement {
  const { open, contentId, openNow, openWithDelay, close } =
    useTooltipContext();
  const child = Children.only(children) as ReactElement<TriggerChildProps>;
  const childProps = child.props;

  const describedBy = open
    ? [childProps['aria-describedby'], contentId].filter(Boolean).join(' ')
    : childProps['aria-describedby'];

  return cloneElement(child, {
    'aria-describedby': describedBy,
    onPointerEnter: composeEventHandlers(
      childProps.onPointerEnter,
      openWithDelay,
    ),
    onPointerLeave: composeEventHandlers(childProps.onPointerLeave, close),
    onPointerDown: composeEventHandlers(childProps.onPointerDown, close),
    onFocus: composeEventHandlers(childProps.onFocus, openNow),
    onBlur: composeEventHandlers(childProps.onBlur, close),
  });
}
