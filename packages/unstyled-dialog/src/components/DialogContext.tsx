import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';

export type DialogContextValue = {
  open: boolean;
  setOpen: (next: boolean) => void;
  titleId: string;
  descriptionId: string;
  hasTitle: boolean;
  hasDescription: boolean;
  /** Called by DialogTitle on mount; returns its own unregister cleanup. */
  registerTitle: () => () => void;
  registerDescription: () => () => void;
};

export const DialogContext = createContext<DialogContextValue | null>(null);

export function useDialogContext(): DialogContextValue {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error(
      'Dialog compound components (DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose) must be rendered inside <Dialog>',
    );
  }
  return context;
}

export function useDialogOpen({
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

  // Lets setOpen ignore no-op calls — the native <dialog> `close` event fires
  // for our own programmatic `el.close()` too, and we don't want that echoing
  // back out as a second onOpenChange(false).
  const actualOpenRef = useRef(actualOpen);
  actualOpenRef.current = actualOpen;

  const setOpen = useCallback(
    (next: boolean) => {
      if (actualOpenRef.current === next) return;
      if (!isControlled) {
        setInternalOpen(next);
      }
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  return { open: actualOpen, setOpen };
}
