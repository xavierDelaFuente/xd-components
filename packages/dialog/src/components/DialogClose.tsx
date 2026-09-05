import {
  DialogClose as UnstyledDialogClose,
  type DialogCloseProps as UnstyledDialogCloseProps,
} from '@asnewyla/unstyled-dialog';
import { type ForwardedRef, forwardRef } from 'react';

export type DialogCloseProps = UnstyledDialogCloseProps;

function DialogCloseInner(
  { className, ...rest }: DialogCloseProps,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  return (
    <UnstyledDialogClose
      {...rest}
      className={className ? `xd-dialog-close ${className}` : 'xd-dialog-close'}
      ref={ref}
    />
  );
}

export const DialogClose = forwardRef<HTMLButtonElement, DialogCloseProps>(
  DialogCloseInner,
);
