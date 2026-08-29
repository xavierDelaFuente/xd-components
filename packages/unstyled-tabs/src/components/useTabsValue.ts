import { useCallback, useState } from 'react';

export function useTabsValue({
  value,
  defaultValue,
  onValueChange,
}: {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const activeValue = isControlled ? value : internalValue;

  const setActiveValue = useCallback(
    (next: string) => {
      if (!isControlled) {
        setInternalValue(next);
      }
      onValueChange?.(next);
    },
    [isControlled, onValueChange],
  );

  return { activeValue, setActiveValue };
}
