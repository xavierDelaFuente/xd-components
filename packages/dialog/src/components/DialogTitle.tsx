import {
  DialogTitle as UnstyledDialogTitle,
  type DialogTitleProps as UnstyledDialogTitleProps,
} from '@asnewyla/unstyled-dialog';
import { type ForwardedRef, forwardRef } from 'react';

export type DialogTitleProps = UnstyledDialogTitleProps;

function DialogTitleInner(
  { className, ...rest }: DialogTitleProps,
  ref: ForwardedRef<HTMLHeadingElement>,
) {
  return (
    <UnstyledDialogTitle
      {...rest}
      className={className ? `xd-dialog-title ${className}` : 'xd-dialog-title'}
      ref={ref}
    />
  );
}

export const DialogTitle = forwardRef<HTMLHeadingElement, DialogTitleProps>(
  DialogTitleInner,
);
