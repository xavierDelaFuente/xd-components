import {
  type ComponentPropsWithoutRef,
  type ForwardedRef,
  forwardRef,
  type ReactEventHandler,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { useDialogContext } from './DialogContext';

export type DialogContentProps = Omit<
  ComponentPropsWithoutRef<'dialog'>,
  'open'
>;

function DialogContentInner(
  { onClose, children, ...rest }: DialogContentProps,
  ref: ForwardedRef<HTMLDialogElement>,
) {
  const { open, setOpen, titleId, descriptionId, hasTitle, hasDescription } =
    useDialogContext();

  const dialogRef = useRef<HTMLDialogElement | null>(null);

  const mergeRef = useCallback(
    (node: HTMLDialogElement | null) => {
      dialogRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    },
    [ref],
  );

  // Drive the native <dialog> imperatively — never render the `open` attribute,
  // which would produce a non-modal dialog.
  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (open && !el.open) {
      el.showModal();
    } else if (!open && el.open) {
      el.close();
    }
  }, [open]);

  // Close on unmount so the browser (and the jsdom shim's registry) don't keep
  // a stale open dialog in the top layer.
  useEffect(() => {
    const el = dialogRef.current;
    return () => {
      if (el?.open) {
        el.close();
      }
    };
  }, []);

  // Light-dismiss: a click whose target is the <dialog> element itself landed
  // on the backdrop area, not on content inside it. Attached as a DOM listener
  // rather than a React onClick prop — it's an element-level interaction (needs
  // the real event target), and the keyboard equivalent (Escape) is handled
  // natively by <dialog>, so this is a mouse-only convenience by design.
  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    const onBackdropClick = (event: MouseEvent) => {
      if (event.target === el) {
        setOpen(false);
      }
    };
    el.addEventListener('click', onBackdropClick);
    return () => el.removeEventListener('click', onBackdropClick);
  }, [setOpen]);

  // Fired by Escape and by our own el.close(); setOpen ignores the no-op case.
  const handleClose: ReactEventHandler<HTMLDialogElement> = (event) => {
    onClose?.(event);
    setOpen(false);
  };

  return (
    <dialog
      {...rest}
      {...(hasTitle ? { 'aria-labelledby': titleId } : {})}
      {...(hasDescription ? { 'aria-describedby': descriptionId } : {})}
      ref={mergeRef}
      data-state={open ? 'open' : 'closed'}
      onClose={handleClose}
    >
      {children}
    </dialog>
  );
}

export const DialogContent = forwardRef<HTMLDialogElement, DialogContentProps>(
  DialogContentInner,
);
