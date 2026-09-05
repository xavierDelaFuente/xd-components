import {
  DialogDescription as UnstyledDialogDescription,
  type DialogDescriptionProps as UnstyledDialogDescriptionProps,
} from '@asnewyla/unstyled-dialog';
import { type ForwardedRef, forwardRef } from 'react';

export type DialogDescriptionProps = UnstyledDialogDescriptionProps;

function DialogDescriptionInner(
  { className, ...rest }: DialogDescriptionProps,
  ref: ForwardedRef<HTMLParagraphElement>,
) {
  return (
    <UnstyledDialogDescription
      {...rest}
      className={
        className
          ? `xd-dialog-description ${className}`
          : 'xd-dialog-description'
      }
      ref={ref}
    />
  );
}

export const DialogDescription = forwardRef<
  HTMLParagraphElement,
  DialogDescriptionProps
>(DialogDescriptionInner);
