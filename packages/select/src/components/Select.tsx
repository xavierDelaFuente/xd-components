import {
  type SelectOption,
  UnstyledSelect,
  type UnstyledSelectProps,
  type UnstyledSelectRenderValueHelpers,
} from '@asnewyla/unstyled-select';
import { type ForwardedRef, forwardRef, useId } from 'react';
import './Select.css';

// `invalid`/`renderValue` live entirely on the common (non-discriminated)
// part of `UnstyledSelectProps`, but `Omit` on a discriminated union still
// risks collapsing it (see unstyled-select's own test-utils for the same
// problem). `T` has to stay a naked type parameter for the conditional to
// distribute over the union member-by-member instead of collapsing it.
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown
  ? Omit<T, K>
  : never;

export type SelectProps = DistributiveOmit<
  UnstyledSelectProps,
  'invalid' | 'renderValue'
> & {
  label: string;
  error?: string;
};

function SelectInner(
  { label, id, error, disabled, className, placeholder, ...rest }: SelectProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const errorId = `${selectId}-error`;
  const labelId = `${selectId}-label`;

  // Always supplied (not just for `multiple`) so the single-select value
  // and the empty-multi-select placeholder are real elements
  // (span.xd-select-value), not a bare text node — Select.css can then
  // dim/truncate them the same way it already does the chips.
  const renderValue = (
    selectedOptions: SelectOption[],
    { removeOption }: UnstyledSelectRenderValueHelpers,
  ) => {
    if (rest.multiple) {
      return selectedOptions.length > 0 ? (
        <span className="xd-select-chips">
          {selectedOptions.map((option) => (
            <span key={option.value} className="xd-select-chip">
              {option.label}
              <button
                type="button"
                className="xd-select-chip-remove"
                aria-label={`Remove ${option.label}`}
                onClick={(e) => {
                  e.stopPropagation();
                  removeOption(option);
                }}
              >
                ×
              </button>
            </span>
          ))}
        </span>
      ) : (
        <span className="xd-select-value" data-placeholder="true">
          {placeholder}
        </span>
      );
    }

    const selected = selectedOptions[0];
    return (
      <span
        className="xd-select-value"
        data-placeholder={selected ? undefined : 'true'}
      >
        {selected ? selected.label : placeholder}
      </span>
    );
  };

  return (
    <div className="xd-select">
      {/* `htmlFor` only auto-associates with labelable elements (input,
      button, select, ...) — the trigger is a plain `role="combobox"` div, so
      it's kept here (harmless, satisfies the a11y/noLabelWithoutControl
      lint) but the real accessible-name link is `aria-labelledby` below. */}
      <label className="xd-select-label" id={labelId} htmlFor={selectId}>
        {label}
      </label>
      <UnstyledSelect
        id={selectId}
        placeholder={placeholder}
        disabled={disabled}
        {...rest}
        invalid={!!error}
        renderValue={renderValue}
        aria-labelledby={labelId}
        aria-describedby={error ? errorId : undefined}
        className={
          className ? `xd-select-trigger ${className}` : 'xd-select-trigger'
        }
        ref={ref}
      />
      {error && (
        <div className="xd-select-error" id={errorId}>
          {error}
        </div>
      )}
    </div>
  );
}

export const Select = forwardRef<HTMLDivElement, SelectProps>(SelectInner);
