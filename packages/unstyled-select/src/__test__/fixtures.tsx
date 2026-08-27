import { type RenderResult, render } from '@testing-library/react';
import { UnstyledSelect, type UnstyledSelectProps } from '../components';

export const fruitOptions: UnstyledSelectProps['options'] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
];

export const fruitOptionsWithDisabled: UnstyledSelectProps['options'] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana', disabled: true },
  { value: 'cherry', label: 'Cherry' },
];

// `options` is the only required field on `UnstyledSelectProps` — every
// other field, including `multiple`, is already correctly optional/required
// per branch of the discriminated union. So overrides only need `options`
// loosened, not the whole type `Partial<>`'d (that would widen `multiple`
// to `true | undefined` in the multi branch and break the union). `T` has
// to stay a naked type parameter for the conditional to distribute over
// the union member-by-member rather than collapsing it.
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown
  ? Omit<T, K>
  : never;
export type SelectOverrides = DistributiveOmit<
  UnstyledSelectProps,
  'options'
> & {
  options?: UnstyledSelectProps['options'];
};

export function renderSelect(overrides: SelectOverrides = {}): RenderResult {
  return render(
    <UnstyledSelect aria-label="Fruit" options={fruitOptions} {...overrides} />,
  );
}
