import {
  DialogContent as UnstyledDialogContent,
  type DialogContentProps as UnstyledDialogContentProps,
} from '@asnewyla/unstyled-dialog';
import { type ForwardedRef, forwardRef } from 'react';
import './Dialog.css';

export type DialogPosition = 'center' | 'left' | 'right' | 'bottom';

export type DialogContentProps = UnstyledDialogContentProps & {
  /** Where the panel sits. `left`/`right`/`bottom` render as a full-height
   * (or full-width, for `bottom`) sheet instead of a centered modal. */
  position?: DialogPosition;
};

function DialogContentInner(
  { className, position = 'center', ...rest }: DialogContentProps,
  ref: ForwardedRef<HTMLDialogElement>,
) {
  return (
    <UnstyledDialogContent
      {...rest}
      className={className ? `xd-dialog ${className}` : 'xd-dialog'}
      data-position={position}
      ref={ref}
    />
  );
}

export const DialogContent = forwardRef<HTMLDialogElement, DialogContentProps>(
  DialogContentInner,
);
