import { type ForwardedRef, forwardRef } from 'react';
import { useSelectOpenState } from './useSelectOpenState';
import { useSelectValue } from './useSelectValue';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

type SingleSelectValueProps = {
  multiple?: false;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
};

type MultiSelectValueProps = {
  multiple: true;
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
};

export type UnstyledSelectProps = (
  | SingleSelectValueProps
  | MultiSelectValueProps
) & {
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
} & Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    'value' | 'defaultValue' | 'onChange' | 'disabled' | 'type'
  >;

function booleanToString(value: boolean | undefined): string | undefined {
  return value ? 'true' : undefined;
}

function UnstyledSelectInner(
  {
    options,
    value,
    defaultValue,
    onChange,
    placeholder,
    disabled,
    onClick,
    multiple,
    ...rest
  }: UnstyledSelectProps,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  const { selectedValues, selectedLabels, selectOption } = useSelectValue({
    options,
    multiple,
    value,
    defaultValue,
    onChange,
  });

  const { open, containerRef, toggle, close } = useSelectOpenState();

  const handleTriggerClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (disabled) return;
    toggle();
  };

  const handleOptionClick = (option: SelectOption) => {
    if (option.disabled) return;
    selectOption(option);
    if (!multiple) close();
  };

  return (
    <div ref={containerRef}>
      <button
        ref={ref}
        {...rest}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
        aria-disabled={disabled ? 'true' : undefined}
        data-disabled={booleanToString(disabled)}
        data-open={booleanToString(open)}
        onClick={handleTriggerClick}
      >
        {selectedLabels.length > 0 ? selectedLabels.join(', ') : placeholder}
      </button>
      {open && (
        <div
          role="listbox"
          aria-multiselectable={multiple ? 'true' : undefined}
        >
          {options.map((option) => {
            const isSelected = selectedValues.includes(option.value);
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                aria-disabled={option.disabled ? 'true' : undefined}
                data-selected={booleanToString(isSelected)}
                data-disabled={booleanToString(option.disabled)}
                onClick={() => handleOptionClick(option)}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export const UnstyledSelect = forwardRef<
  HTMLButtonElement,
  UnstyledSelectProps
>(UnstyledSelectInner);
