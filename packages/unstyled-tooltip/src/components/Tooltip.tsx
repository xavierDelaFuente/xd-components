import {
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ForwardedRef,
  forwardRef,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
} from 'react';
import { TooltipContext, useTooltipOpen } from './TooltipContext';

export type TooltipProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Hover open delay in ms. Keyboard focus always opens with no delay. */
  delay?: number;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<'span'>, 'onChange' | 'children'>;

function TooltipInner(
  {
    open,
    defaultOpen,
    onOpenChange,
    delay = 700,
    children,
    style,
    ...rest
  }: TooltipProps,
  ref: ForwardedRef<HTMLSpanElement>,
) {
  const contentId = useId();
  const { open: isOpen, setOpen } = useTooltipOpen({
    open,
    defaultOpen,
    onOpenChange,
  });

  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearOpenTimer = useCallback(() => {
    if (openTimer.current !== null) {
      clearTimeout(openTimer.current);
      openTimer.current = null;
    }
  }, []);

  const close = useCallback(() => {
    clearOpenTimer();
    setOpen(false);
  }, [clearOpenTimer, setOpen]);

  const openNow = useCallback(() => {
    clearOpenTimer();
    setOpen(true);
  }, [clearOpenTimer, setOpen]);

  const openWithDelay = useCallback(() => {
    clearOpenTimer();
    if (delay <= 0) {
      setOpen(true);
      return;
    }
    openTimer.current = setTimeout(() => {
      openTimer.current = null;
      setOpen(true);
    }, delay);
  }, [clearOpenTimer, delay, setOpen]);

  useEffect(() => clearOpenTimer, [clearOpenTimer]);

  // Escape closes an open tooltip — WAI-ARIA APG's one hard requirement.
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, close]);

  const contextValue = useMemo(
    () => ({ open: isOpen, contentId, openNow, openWithDelay, close }),
    [isOpen, contentId, openNow, openWithDelay, close],
  );

  // A shrink-wrapped positioned box so TooltipContent can place itself with
  // plain CSS (position: absolute + data-side) — no portal, no measurement.
  const wrapperStyle: CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    ...style,
  };

  return (
    <TooltipContext.Provider value={contextValue}>
      <span {...rest} ref={ref} style={wrapperStyle}>
        {children}
      </span>
    </TooltipContext.Provider>
  );
}

export const Tooltip = forwardRef<HTMLSpanElement, TooltipProps>(TooltipInner);
