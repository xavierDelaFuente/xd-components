import { RadioGroupProvider } from '@asnewyla/radio';
import {
  type ComponentPropsWithoutRef,
  type ForwardedRef,
  forwardRef,
  type ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react';

export type RadioGroupProps = Omit<
  ComponentPropsWithoutRef<'div'>,
  'role' | 'onChange' | 'defaultValue'
> & {
  name: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  children: ReactNode;
};

function RadioGroupInner(
  { name, value, defaultValue, onChange, children, ...rest }: RadioGroupProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const resolvedValue = isControlled ? value : internalValue;

  const handleChange = useCallback(
    (nextValue: string) => {
      if (!isControlled) {
        setInternalValue(nextValue);
      }
      onChange?.(nextValue);
    },
    [isControlled, onChange],
  );

  const contextValue = useMemo(
    () => ({ name, value: resolvedValue, onChange: handleChange }),
    [name, resolvedValue, handleChange],
  );

  return (
    <div ref={ref} role="radiogroup" {...rest}>
      <RadioGroupProvider value={contextValue}>{children}</RadioGroupProvider>
    </div>
  );
}

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  RadioGroupInner,
);
