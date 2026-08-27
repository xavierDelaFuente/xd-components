import {
  type ChangeEvent,
  type ForwardedRef,
  forwardRef,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { useRovingFocus } from './useRovingFocus';
import { useSelectOpenState } from './useSelectOpenState';
import { useSelectValue } from './useSelectValue';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface UnstyledSelectRenderValueHelpers {
  removeOption: (option: SelectOption) => void;
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
  invalid?: boolean;
  renderValue?: (
    selectedOptions: SelectOption[],
    helpers: UnstyledSelectRenderValueHelpers,
  ) => ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

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
    invalid,
    onClick,
    onKeyDown,
    multiple,
    renderValue,
    ...rest
  }: UnstyledSelectProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const [searchValue, setSearchValue] = useState('');

  const filteredOptions = useMemo(() => {
    const query = searchValue.toLowerCase();
    if (!query) return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(query),
    );
  }, [options, searchValue]);

  const { selectedValues, selectedOptions, selectedLabels, selectOption } =
    useSelectValue({ options, multiple, value, defaultValue, onChange });

  const {
    setTriggerRef,
    setSearchInputRef,
    getOptionRef,
    focusTrigger,
    focusSearchInput,
    handleListboxKeyDown,
  } = useRovingFocus({ options: filteredOptions });

  const handleEscape = useCallback(() => {
    setSearchValue('');
    focusTrigger();
  }, [focusTrigger]);

  const { open, containerRef, toggle, close } = useSelectOpenState({
    onEscape: handleEscape,
  });

  const setRefs = (node: HTMLDivElement | null) => {
    setTriggerRef(node);
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  };

  const handleTriggerClick = (e: MouseEvent<HTMLDivElement>) => {
    onClick?.(e);
    if (disabled) return;
    const nextOpen = toggle();
    if (nextOpen) focusSearchInput();
  };

  const handleTriggerKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (disabled) return;
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    const nextOpen = toggle();
    if (nextOpen) focusSearchInput();
  };

  const handleOptionClick = (option: SelectOption) => {
    if (option.disabled) return;
    selectOption(option);
    setSearchValue('');
    if (!multiple) {
      close();
      focusTrigger();
    }
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  return (
    <div ref={containerRef}>
      <div
        ref={setRefs}
        {...rest}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-disabled={disabled ? 'true' : undefined}
        aria-invalid={invalid ? 'true' : undefined}
        data-disabled={booleanToString(disabled)}
        data-invalid={booleanToString(invalid)}
        data-open={booleanToString(open)}
        tabIndex={disabled ? -1 : 0}
        onClick={handleTriggerClick}
        onKeyDown={handleTriggerKeyDown}
      >
        {renderValue
          ? renderValue(selectedOptions, { removeOption: selectOption })
          : selectedLabels.length > 0
            ? selectedLabels.join(', ')
            : placeholder}
      </div>
      {open && (
        <div
          role="listbox"
          aria-multiselectable={multiple ? 'true' : undefined}
          onKeyDown={handleListboxKeyDown}
        >
          <div>
            <input
              ref={setSearchInputRef}
              aria-label="Search options"
              value={searchValue}
              onChange={handleSearchChange}
            />
          </div>
          {filteredOptions.map((option) => {
            const isSelected = selectedValues.includes(option.value);
            return (
              <button
                key={option.value}
                ref={getOptionRef(option.value)}
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

export const UnstyledSelect = forwardRef<HTMLDivElement, UnstyledSelectProps>(
  UnstyledSelectInner,
);
