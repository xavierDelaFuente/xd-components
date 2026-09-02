import {
  type ComponentPropsWithoutRef,
  type ForwardedRef,
  forwardRef,
  type MouseEvent,
} from 'react';
import { useDialogContext } from './DialogContext';

export type DialogCloseProps = Omit<ComponentPropsWithoutRef<'button'>, 'type'>;

function DialogCloseInner(
  { onClick, ...rest }: DialogCloseProps,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  const { setOpen } = useDialogContext();

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    setOpen(false);
  };

  return <button {...rest} ref={ref} type="button" onClick={handleClick} />;
}

export const DialogClose = forwardRef<HTMLButtonElement, DialogCloseProps>(
  DialogCloseInner,
);
