import {
  type ComponentPropsWithoutRef,
  type ForwardedRef,
  forwardRef,
  type MouseEvent,
} from 'react';
import { useDialogContext } from './DialogContext';

export type DialogTriggerProps = Omit<
  ComponentPropsWithoutRef<'button'>,
  'type' | 'aria-haspopup' | 'aria-expanded'
>;

function DialogTriggerInner(
  { onClick, disabled, ...rest }: DialogTriggerProps,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  const { open, setOpen } = useDialogContext();

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (!disabled) {
      setOpen(true);
    }
  };

  return (
    <button
      {...rest}
      ref={ref}
      type="button"
      aria-haspopup="dialog"
      aria-expanded={open}
      disabled={disabled}
      onClick={handleClick}
    />
  );
}

export const DialogTrigger = forwardRef<HTMLButtonElement, DialogTriggerProps>(
  DialogTriggerInner,
);
