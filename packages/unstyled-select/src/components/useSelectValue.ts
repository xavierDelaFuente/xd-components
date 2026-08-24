import { useState } from 'react';
import type { SelectOption } from './UnstyledSelect';

interface UseSelectValueParams {
  options: SelectOption[];
  multiple: boolean | undefined;
  value: string | string[] | undefined;
  defaultValue: string | string[] | undefined;
  onChange: ((value: string) => void) | ((value: string[]) => void) | undefined;
}

export interface UseSelectValueResult {
  selectedValues: string[];
  selectedLabels: string[];
  selectOption: (option: SelectOption) => void;
}

export function useSelectValue({
  options,
  multiple,
  value,
  defaultValue,
  onChange,
}: UseSelectValueParams): UseSelectValueResult {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<
    string | string[] | undefined
  >(defaultValue);
  const currentValue = isControlled ? value : internalValue;

  // Both branches of the value union normalize to this one array so
  // consumers of the hook don't need to branch on `multiple` again.
  const selectedValues: string[] = multiple
    ? ((currentValue as string[] | undefined) ?? [])
    : currentValue !== undefined
      ? [currentValue as string]
      : [];

  const selectedLabels = options
    .filter((option) => selectedValues.includes(option.value))
    .map((option) => option.label);

  const selectOption = (option: SelectOption) => {
    if (multiple) {
      const next = selectedValues.includes(option.value)
        ? selectedValues.filter((v) => v !== option.value)
        : [...selectedValues, option.value];
      if (!isControlled) {
        setInternalValue(next);
      }
      (onChange as ((value: string[]) => void) | undefined)?.(next);
      return;
    }

    if (!isControlled) {
      setInternalValue(option.value);
    }
    (onChange as ((value: string) => void) | undefined)?.(option.value);
  };

  return { selectedValues, selectedLabels, selectOption };
}
