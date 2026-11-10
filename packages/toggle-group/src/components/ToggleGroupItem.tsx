import { Button, type ButtonProps } from '@asnewyla/button';
import { type ForwardedRef, forwardRef, type MouseEvent } from 'react';
import { useToggleGroupContext } from './ToggleGroupContext';

export type ToggleGroupItemProps = Omit<
  ButtonProps<'button'>,
  'as' | 'variant' | 'value' | 'aria-pressed'
> & {
  /** Identifies the item in the group, and is its native `value` on submit. */
  value: string;
};

function ToggleGroupItemInner(
  { value, name, size, disabled, onClick, ...restProps }: ToggleGroupItemProps,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  const group = useToggleGroupContext();
  const pressed = group?.value === value;

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    onClick?.(event);
    group?.select(value);
  }

  return (
    <Button
      {...restProps}
      ref={ref as ForwardedRef<Element>}
      aria-pressed={pressed}
      variant={pressed ? 'primary' : 'outline'}
      value={value}
      name={name ?? group?.name}
      size={size ?? group?.size ?? 'md'}
      disabled={disabled ?? group?.disabled ?? false}
      onClick={handleClick}
    />
  );
}

export const ToggleGroupItem = forwardRef(ToggleGroupItemInner);
