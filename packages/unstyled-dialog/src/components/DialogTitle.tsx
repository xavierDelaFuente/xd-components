import {
  type ComponentPropsWithoutRef,
  type ForwardedRef,
  forwardRef,
  useEffect,
} from 'react';
import { useDialogContext } from './DialogContext';

export type DialogTitleProps = Omit<ComponentPropsWithoutRef<'h2'>, 'id'>;

function DialogTitleInner(
  props: DialogTitleProps,
  ref: ForwardedRef<HTMLHeadingElement>,
) {
  const { titleId, registerTitle } = useDialogContext();

  // Presence registration — lets DialogContent set aria-labelledby only when a
  // title is actually rendered.
  useEffect(() => registerTitle(), [registerTitle]);

  return <h2 {...props} ref={ref} id={titleId} />;
}

export const DialogTitle = forwardRef<HTMLHeadingElement, DialogTitleProps>(
  DialogTitleInner,
);
