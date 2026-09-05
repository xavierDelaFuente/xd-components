import {
  DialogTrigger as UnstyledDialogTrigger,
  type DialogTriggerProps as UnstyledDialogTriggerProps,
} from '@asnewyla/unstyled-dialog';
import { type ForwardedRef, forwardRef } from 'react';

export type DialogTriggerProps = UnstyledDialogTriggerProps;

function DialogTriggerInner(
  { className, ...rest }: DialogTriggerProps,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  return (
    <UnstyledDialogTrigger
      {...rest}
      className={
        className ? `xd-dialog-trigger ${className}` : 'xd-dialog-trigger'
      }
      ref={ref}
    />
  );
}

export const DialogTrigger = forwardRef<HTMLButtonElement, DialogTriggerProps>(
  DialogTriggerInner,
);
