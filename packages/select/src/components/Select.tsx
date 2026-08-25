import {
  type SelectOption,
  UnstyledSelect,
  type UnstyledSelectProps,
  type UnstyledSelectRenderValueHelpers,
} from '@asnewyla/unstyled-select';
import { type ForwardedRef, forwardRef, useId } from 'react';
import './Select.css';

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

  const renderValue = rest.multiple
    ? (
        selectedOptions: SelectOption[],
        { removeOption }: UnstyledSelectRenderValueHelpers,
      ) =>
        selectedOptions.length > 0 ? (
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
          placeholder
        )
    : undefined;

  return (
    <div className="xd-select">
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
