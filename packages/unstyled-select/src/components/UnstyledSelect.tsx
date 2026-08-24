import {
  type ForwardedRef,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from 'react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export type UnstyledSelectProps = {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
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
    ...rest
  }: UnstyledSelectProps,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const selectedValue = isControlled ? value : internalValue;
  const selectedOption = options.find(
    (option) => option.value === selectedValue,
  );

  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(e: MouseEvent) {
      if (
        containerRef.current &&
        e.target instanceof Node &&
        !containerRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const handleTriggerClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (disabled) return;
    setOpen((prev) => !prev);
  };

  const handleOptionClick = (option: SelectOption) => {
    if (option.disabled) return;
    if (!isControlled) {
      setInternalValue(option.value);
    }
    onChange?.(option.value);
    setOpen(false);
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
        {selectedOption ? selectedOption.label : placeholder}
      </button>
      {open && (
        <div role="listbox">
          {options.map((option) => {
            const isSelected = option.value === selectedValue;
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
