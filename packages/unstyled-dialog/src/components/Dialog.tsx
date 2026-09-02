import { type ReactNode, useCallback, useId, useMemo, useState } from 'react';
import { DialogContext, useDialogOpen } from './DialogContext';

export type DialogProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
};

// The root renders no DOM of its own — it only owns state and provides context.
// DialogContent's native <dialog> lives in the top layer regardless of where
// this sits in the tree, so a wrapper element would add nothing.
export function Dialog({
  open,
  defaultOpen,
  onOpenChange,
  children,
}: DialogProps) {
  const baseId = useId();
  const { open: isOpen, setOpen } = useDialogOpen({
    open,
    defaultOpen,
    onOpenChange,
  });

  const [titleCount, setTitleCount] = useState(0);
  const [descriptionCount, setDescriptionCount] = useState(0);

  const registerTitle = useCallback(() => {
    setTitleCount((count) => count + 1);
    return () => setTitleCount((count) => count - 1);
  }, []);
  const registerDescription = useCallback(() => {
    setDescriptionCount((count) => count + 1);
    return () => setDescriptionCount((count) => count - 1);
  }, []);

  const value = useMemo(
    () => ({
      open: isOpen,
      setOpen,
      titleId: `${baseId}-title`,
      descriptionId: `${baseId}-description`,
      hasTitle: titleCount > 0,
      hasDescription: descriptionCount > 0,
      registerTitle,
      registerDescription,
    }),
    [
      isOpen,
      setOpen,
      baseId,
      titleCount,
      descriptionCount,
      registerTitle,
      registerDescription,
    ],
  );

  return (
    <DialogContext.Provider value={value}>{children}</DialogContext.Provider>
  );
}
