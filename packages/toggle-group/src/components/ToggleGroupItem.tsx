import { Button, type ButtonProps } from '@asnewyla/button';
import { type ForwardedRef, forwardRef } from 'react';
import { useToggleGroupContext } from './ToggleGroupContext';

export type ToggleGroupItemProps = Omit<
  ButtonProps<'button'>,
  'as' | 'variant' | 'value'
> & {
  /** Identifies the item in the group, and is its native `value` on submit. */
  value: string;
};

function ToggleGroupItemInner(
  { value, name, size, disabled, ...restProps }: ToggleGroupItemProps,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  const group = useToggleGroupContext();

  return (
    <Button
      {...restProps}
      ref={ref as ForwardedRef<Element>}
      variant="outline"
      value={value}
      name={name ?? group?.name}
      size={size ?? group?.size ?? 'md'}
      disabled={disabled ?? group?.disabled ?? false}
    />
  );
}

export const ToggleGroupItem = forwardRef(ToggleGroupItemInner);
