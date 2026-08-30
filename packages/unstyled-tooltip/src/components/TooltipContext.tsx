import { createContext, useCallback, useContext, useState } from 'react';

export type TooltipContextValue = {
  open: boolean;
  contentId: string;
  /** Open now, no delay — used for keyboard focus. */
  openNow: () => void;
  /** Open after the configured hover delay — used for pointer enter. */
  openWithDelay: () => void;
  /** Close now and cancel any pending open. */
  close: () => void;
};

export const TooltipContext = createContext<TooltipContextValue | null>(null);

export function useTooltipContext(): TooltipContextValue {
  const context = useContext(TooltipContext);
  if (!context) {
    throw new Error(
      'Tooltip compound components (TooltipTrigger, TooltipContent) must be rendered inside <Tooltip>',
    );
  }
  return context;
}

export function useTooltipOpen({
  open,
  defaultOpen,
  onOpenChange,
}: {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}): { open: boolean; setOpen: (next: boolean) => void } {
  const isControlled = open !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen ?? false);
  const actualOpen = isControlled ? open : internalOpen;

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) {
        setInternalOpen(next);
      }
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  return { open: actualOpen, setOpen };
}
