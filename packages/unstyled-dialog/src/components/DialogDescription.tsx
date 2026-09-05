import {
  type ComponentPropsWithoutRef,
  type ForwardedRef,
  forwardRef,
  useEffect,
} from 'react';
import { useDialogContext } from './DialogContext';

export type DialogDescriptionProps = Omit<ComponentPropsWithoutRef<'p'>, 'id'>;

function DialogDescriptionInner(
  props: DialogDescriptionProps,
  ref: ForwardedRef<HTMLParagraphElement>,
) {
  const { descriptionId, registerDescription } = useDialogContext();

  useEffect(() => registerDescription(), [registerDescription]);

  return <p {...props} ref={ref} id={descriptionId} />;
}

export const DialogDescription = forwardRef<
  HTMLParagraphElement,
  DialogDescriptionProps
>(DialogDescriptionInner);
