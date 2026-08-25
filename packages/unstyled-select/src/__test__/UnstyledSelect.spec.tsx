import { render, screen } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import { createRef } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UnstyledSelect, type UnstyledSelectProps } from '../components';
import {
  clearQuery,
  clickOption,
  closeSelect,
  getCombobox,
  getListbox,
  getOption,
  getOptionLabels,
  getSearchInput,
  openSelect,
  queryListbox,
  queryOptionLabels,
  typeQuery,
} from '../test-utils';

const fruitOptions: UnstyledSelectProps['options'] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
];

const fruitOptionsWithDisabled: UnstyledSelectProps['options'] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana', disabled: true },
  { value: 'cherry', label: 'Cherry' },
];

let user: UserEvent;

beforeEach(() => {
  user = userEvent.setup();
});

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
type SelectOverrides = DistributiveOmit<UnstyledSelectProps, 'options'> & {
  options?: UnstyledSelectProps['options'];
};

function renderSelect(overrides: SelectOverrides = {}) {
  return render(
    <UnstyledSelect aria-label="Fruit" options={fruitOptions} {...overrides} />,
  );
}

describe('UnstyledSelect — single-select core mechanics', () => {
  it('renders a combobox trigger', () => {
    renderSelect();

    expect(getCombobox()).toBeInTheDocument();
  });

  it('is closed by default — no listbox in the document', () => {
    renderSelect();

    expect(queryListbox()).not.toBeInTheDocument();
    expect(getCombobox()).toHaveAttribute('aria-expanded', 'false');
  });

  it('shows placeholder text when nothing is selected', () => {
    renderSelect({ placeholder: 'Choose a fruit' });

    expect(getCombobox()).toHaveTextContent('Choose a fruit');
  });

  it('opens the listbox and renders every option on click', async () => {
    renderSelect();

    await openSelect(user);

    expect(getOptionLabels()).toEqual(['Apple', 'Banana', 'Cherry']);
    expect(getCombobox()).toHaveAttribute('aria-expanded', 'true');
  });

  it('is uncontrolled by default — defaultValue shows the matching option label', () => {
    renderSelect({ defaultValue: 'banana' });

    expect(getCombobox()).toHaveTextContent('Banana');
  });

  it('clicking an option selects it, calls onChange, and closes the listbox', async () => {
    const handleChange = vi.fn();
    renderSelect({ onChange: handleChange });

    await openSelect(user);
    await clickOption(user, 'Banana');

    expect(handleChange).toHaveBeenCalledWith('banana');
    expect(getCombobox()).toHaveTextContent('Banana');
    expect(queryListbox()).not.toBeInTheDocument();
  });

  it('marks the currently selected option with aria-selected', async () => {
    renderSelect({ defaultValue: 'cherry' });

    await openSelect(user);

    expect(getOption('Cherry')).toHaveAttribute('aria-selected', 'true');
    expect(getOption('Apple')).toHaveAttribute('aria-selected', 'false');
  });

  it('supports controlled usage via value + onChange', async () => {
    const handleChange = vi.fn();
    renderSelect({ value: 'apple', onChange: handleChange });

    await openSelect(user);
    await clickOption(user, 'Banana');

    expect(handleChange).toHaveBeenCalledWith('banana');
    expect(getCombobox()).toHaveTextContent('Apple');
  });

  it('does not select or close when clicking a disabled option', async () => {
    const handleChange = vi.fn();
    const options = [
      ...fruitOptions,
      { value: 'durian', label: 'Durian', disabled: true },
    ];
    renderSelect({ options, onChange: handleChange });

    await openSelect(user);
    await clickOption(user, 'Durian');

    expect(handleChange).not.toHaveBeenCalled();
    expect(getListbox()).toBeInTheDocument();
  });

  it('marks a disabled option with aria-disabled', async () => {
    const options = [
      ...fruitOptions,
      { value: 'durian', label: 'Durian', disabled: true },
    ];
    renderSelect({ options });

    await openSelect(user);

    expect(getOption('Durian')).toHaveAttribute('aria-disabled', 'true');
  });

  it('does not open when the whole select is disabled', async () => {
    renderSelect({ disabled: true });

    await openSelect(user);

    expect(queryListbox()).not.toBeInTheDocument();
  });

  it('sets aria-disabled on the trigger when disabled', () => {
    renderSelect({ disabled: true });

    expect(getCombobox()).toHaveAttribute('aria-disabled', 'true');
  });

  it('sets data-invalid and aria-invalid when invalid', () => {
    renderSelect({ invalid: true });

    expect(getCombobox()).toHaveAttribute('data-invalid', 'true');
    expect(getCombobox()).toHaveAttribute('aria-invalid', 'true');
  });

  it('omits data-invalid and aria-invalid when not invalid', () => {
    renderSelect();

    expect(getCombobox()).not.toHaveAttribute('data-invalid');
    expect(getCombobox()).not.toHaveAttribute('aria-invalid');
  });

  it('closes the listbox when clicking outside', async () => {
    render(
      <div>
        <UnstyledSelect aria-label="Fruit" options={fruitOptions} />
        <button type="button">Outside</button>
      </div>,
    );

    await openSelect(user);
    expect(getListbox()).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Outside' }));

    expect(queryListbox()).not.toBeInTheDocument();
  });

  it('closes the listbox on Escape', async () => {
    renderSelect();

    await openSelect(user);
    expect(getListbox()).toBeInTheDocument();

    await closeSelect(user);

    expect(queryListbox()).not.toBeInTheDocument();
  });

  it('forwards a ref to the trigger element', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <UnstyledSelect aria-label="Fruit" options={fruitOptions} ref={ref} />,
    );

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toBe(getCombobox());
  });

  it('passes through arbitrary native div attributes', () => {
    renderSelect({ title: 'Pick a fruit' });

    expect(getCombobox()).toHaveAttribute('title', 'Pick a fruit');
  });

  it('is focusable via Tab key', async () => {
    renderSelect();

    await user.tab();

    expect(getCombobox()).toHaveFocus();
  });

  it('is not focusable via Tab key when disabled', async () => {
    renderSelect({ disabled: true });

    await user.tab();

    expect(getCombobox()).not.toHaveFocus();
  });

  it('Enter on the focused trigger opens the listbox and focuses the search input', async () => {
    renderSelect();

    await user.tab();
    await user.keyboard('{Enter}');

    expect(getSearchInput()).toHaveFocus();
  });

  it('Space on the focused trigger opens the listbox and focuses the search input', async () => {
    renderSelect();

    await user.tab();
    await user.keyboard(' ');

    expect(getSearchInput()).toHaveFocus();
  });

  it('Enter on the focused trigger does not open the listbox when disabled', async () => {
    renderSelect({ disabled: true });

    getCombobox().focus();
    await user.keyboard('{Enter}');

    expect(queryListbox()).not.toBeInTheDocument();
  });
});

describe('UnstyledSelect — multi-select', () => {
  it('marks the listbox aria-multiselectable when multiple', async () => {
    renderSelect({ multiple: true });

    await openSelect(user);

    expect(getListbox()).toHaveAttribute('aria-multiselectable', 'true');
  });

  it('shows placeholder text when nothing is selected', () => {
    renderSelect({ multiple: true, placeholder: 'Choose fruits' });

    expect(getCombobox()).toHaveTextContent('Choose fruits');
  });

  it('is uncontrolled by default — defaultValue shows every selected label', () => {
    renderSelect({ multiple: true, defaultValue: ['apple', 'cherry'] });
    const trigger = getCombobox();

    expect(trigger).toHaveTextContent('Apple');
    expect(trigger).toHaveTextContent('Cherry');
  });

  it('clicking an unselected option adds it, calls onChange with the full array, and keeps the listbox open', async () => {
    const handleChange = vi.fn();
    renderSelect({
      multiple: true,
      defaultValue: ['apple'],
      onChange: handleChange,
    });

    await openSelect(user);
    await clickOption(user, 'Banana');

    expect(handleChange).toHaveBeenCalledWith(['apple', 'banana']);
    expect(getListbox()).toBeInTheDocument();
  });

  it('clicking an already-selected option removes it from the value', async () => {
    const handleChange = vi.fn();
    renderSelect({
      multiple: true,
      defaultValue: ['apple', 'banana'],
      onChange: handleChange,
    });

    await openSelect(user);
    await clickOption(user, 'Apple');

    expect(handleChange).toHaveBeenCalledWith(['banana']);
  });

  it('shows the placeholder again once every selection is removed (uncontrolled)', async () => {
    renderSelect({
      multiple: true,
      defaultValue: ['apple'],
      placeholder: 'Choose fruits',
    });

    await openSelect(user);
    await clickOption(user, 'Apple');

    expect(getCombobox()).toHaveTextContent('Choose fruits');
  });

  it('marks every selected option with aria-selected, not just one', async () => {
    renderSelect({ multiple: true, defaultValue: ['apple', 'cherry'] });

    await openSelect(user);

    expect(getOption('Apple')).toHaveAttribute('aria-selected', 'true');
    expect(getOption('Cherry')).toHaveAttribute('aria-selected', 'true');
    expect(getOption('Banana')).toHaveAttribute('aria-selected', 'false');
  });

  it('supports controlled usage via value + onChange', async () => {
    const handleChange = vi.fn();
    renderSelect({ multiple: true, value: ['apple'], onChange: handleChange });

    await openSelect(user);
    await clickOption(user, 'Banana');

    expect(handleChange).toHaveBeenCalledWith(['apple', 'banana']);
    // still just "Apple" — nothing updated the value prop, matching every
    // other controlled component in this codebase
    const trigger = getCombobox();
    expect(trigger).toHaveTextContent('Apple');
    expect(trigger).not.toHaveTextContent('Banana');
  });

  it('does not toggle the value or call onChange when clicking a disabled option', async () => {
    const handleChange = vi.fn();
    const options = [
      ...fruitOptions,
      { value: 'durian', label: 'Durian', disabled: true },
    ];
    renderSelect({
      options,
      multiple: true,
      defaultValue: ['apple'],
      onChange: handleChange,
    });

    await openSelect(user);
    await clickOption(user, 'Durian');

    expect(handleChange).not.toHaveBeenCalled();
  });
});

describe('UnstyledSelect — keyboard navigation', () => {
  it('focuses the search input when opened', async () => {
    renderSelect();

    await openSelect(user);

    expect(getSearchInput()).toHaveFocus();
  });

  it('ArrowDown from the search input moves focus to the first option', async () => {
    renderSelect();

    await openSelect(user);
    await user.keyboard('{ArrowDown}');

    expect(getOption('Apple')).toHaveFocus();
  });

  it('ArrowUp from the first option moves focus back to the search input', async () => {
    renderSelect();

    await openSelect(user);
    await user.keyboard('{ArrowDown}{ArrowUp}');

    expect(getSearchInput()).toHaveFocus();
  });

  it('ArrowDown moves focus to the next option', async () => {
    renderSelect();

    await openSelect(user);
    await user.keyboard('{ArrowDown}{ArrowDown}');

    expect(getOption('Banana')).toHaveFocus();
  });

  it('ArrowUp moves focus to the previous option', async () => {
    renderSelect();

    await openSelect(user);
    await user.keyboard('{ArrowDown}{ArrowDown}{ArrowUp}');

    expect(getOption('Apple')).toHaveFocus();
  });

  it('ArrowDown does not move past the last option', async () => {
    renderSelect();

    await openSelect(user);
    await user.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}{ArrowDown}');

    expect(getOption('Cherry')).toHaveFocus();
  });

  it('ArrowDown skips a disabled option', async () => {
    renderSelect({ options: fruitOptionsWithDisabled });

    await openSelect(user);
    await user.keyboard('{ArrowDown}{ArrowDown}');

    expect(getOption('Cherry')).toHaveFocus();
  });

  it('ArrowUp skips a disabled option', async () => {
    renderSelect({ options: fruitOptionsWithDisabled });

    await openSelect(user);
    await user.keyboard('{End}{ArrowUp}');

    expect(getOption('Apple')).toHaveFocus();
  });

  it('Home moves focus to the first enabled option', async () => {
    renderSelect();

    await openSelect(user);
    await user.keyboard('{ArrowDown}{ArrowDown}{Home}');

    expect(getOption('Apple')).toHaveFocus();
  });

  it('End moves focus to the last enabled option', async () => {
    renderSelect();

    await openSelect(user);
    await user.keyboard('{End}');

    expect(getOption('Cherry')).toHaveFocus();
  });

  it('Enter selects the focused option and closes the listbox (single-select)', async () => {
    const handleChange = vi.fn();
    renderSelect({ onChange: handleChange });

    await openSelect(user);
    await user.keyboard('{ArrowDown}{ArrowDown}{Enter}');

    expect(handleChange).toHaveBeenCalledWith('banana');
    expect(queryListbox()).not.toBeInTheDocument();
  });

  it('in multi-select mode, Enter toggles the focused option without closing the listbox', async () => {
    const handleChange = vi.fn();
    renderSelect({ multiple: true, onChange: handleChange });

    await openSelect(user);
    await user.keyboard('{ArrowDown}{Enter}');

    expect(handleChange).toHaveBeenCalledWith(['apple']);
    expect(getListbox()).toBeInTheDocument();
    expect(getOption('Apple')).toHaveFocus();
  });

  it('closing via Escape returns focus to the trigger', async () => {
    renderSelect();

    await openSelect(user);
    await closeSelect(user);

    expect(getCombobox()).toHaveFocus();
  });

  it('closing via selecting an option returns focus to the trigger (single-select)', async () => {
    renderSelect();

    await openSelect(user);
    await clickOption(user, 'Banana');

    expect(getCombobox()).toHaveFocus();
  });
});

describe('UnstyledSelect — search / filter', () => {
  it('renders a search input inside the popup when opened', async () => {
    renderSelect();

    await openSelect(user);

    expect(getSearchInput()).toBeInTheDocument();
  });

  it('the search input starts empty when the listbox opens', async () => {
    renderSelect();

    await openSelect(user);

    expect(getSearchInput()).toHaveValue('');
  });

  it('typing filters the rendered options by label, case-insensitively', async () => {
    renderSelect();

    await openSelect(user);
    await typeQuery(user, 'AN');

    expect(getOptionLabels()).toEqual(['Banana']);
  });

  it('shows no options when the query matches nothing', async () => {
    renderSelect();

    await openSelect(user);
    await typeQuery(user, 'xyz');

    expect(queryOptionLabels()).toEqual([]);
  });

  it('clearing the query shows every option again', async () => {
    renderSelect();

    await openSelect(user);
    await typeQuery(user, 'an');
    await clearQuery(user);

    expect(getOptionLabels()).toEqual(['Apple', 'Banana', 'Cherry']);
  });

  it('keyboard navigation operates over the filtered results, not the full list', async () => {
    renderSelect();

    await openSelect(user);
    await typeQuery(user, 'a');
    await user.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}');

    // "Cherry" doesn't match "a" and is filtered out, so ArrowDown clamps
    // at "Banana" (the last filtered result) rather than reaching it
    expect(getOption('Banana')).toHaveFocus();
  });

  it('selecting a filtered option selects the right value', async () => {
    const handleChange = vi.fn();
    renderSelect({ onChange: handleChange });

    await openSelect(user);
    await typeQuery(user, 'an');
    await user.keyboard('{ArrowDown}{Enter}');

    expect(handleChange).toHaveBeenCalledWith('banana');
  });

  it('resets the query when the listbox closes without selecting (Escape)', async () => {
    renderSelect();

    await openSelect(user);
    await typeQuery(user, 'an');
    await closeSelect(user);
    await openSelect(user);

    expect(getSearchInput()).toHaveValue('');
    expect(getOptionLabels()).toEqual(['Apple', 'Banana', 'Cherry']);
  });

  it('resets the query after selecting an option (single-select)', async () => {
    renderSelect();

    await openSelect(user);
    await typeQuery(user, 'an');
    await user.keyboard('{ArrowDown}{Enter}');
    await openSelect(user);

    expect(getSearchInput()).toHaveValue('');
    expect(getOptionLabels()).toEqual(['Apple', 'Banana', 'Cherry']);
  });

  it('a disabled option matching the query still shows aria-disabled', async () => {
    renderSelect({ options: fruitOptionsWithDisabled });

    await openSelect(user);
    await typeQuery(user, 'ban');

    expect(getOption('Banana')).toHaveAttribute('aria-disabled', 'true');
  });

  it('multi-select also supports search filtering', async () => {
    renderSelect({ multiple: true });

    await openSelect(user);
    await typeQuery(user, 'an');

    expect(getOptionLabels()).toEqual(['Banana']);
  });
});

describe('UnstyledSelect — renderValue', () => {
  it('uses renderValue instead of the default text when provided', () => {
    renderSelect({
      defaultValue: 'banana',
      renderValue: (selectedOptions) => (
        <span data-testid="custom-value">
          {selectedOptions.map((option) => option.label).join(' + ')}
        </span>
      ),
    });

    expect(screen.getByTestId('custom-value')).toHaveTextContent('Banana');
  });

  it('passes the current selection as SelectOption objects, not just values', () => {
    renderSelect({
      multiple: true,
      defaultValue: ['apple', 'cherry'],
      renderValue: (selectedOptions) => (
        <span data-testid="custom-value">
          {selectedOptions.map((option) => option.value).join(',')}
        </span>
      ),
    });

    expect(screen.getByTestId('custom-value')).toHaveTextContent(
      'apple,cherry',
    );
  });

  it('removeOption deselects the given option and calls onChange with the updated array', async () => {
    const handleChange = vi.fn();
    renderSelect({
      multiple: true,
      defaultValue: ['apple', 'banana'],
      onChange: handleChange,
      renderValue: (selectedOptions, { removeOption }) => (
        <div>
          {selectedOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeOption(option);
              }}
            >
              Remove {option.label}
            </button>
          ))}
        </div>
      ),
    });

    await user.click(screen.getByRole('button', { name: 'Remove Apple' }));

    expect(handleChange).toHaveBeenCalledWith(['banana']);
  });

  it("removeOption's click does not also toggle the listbox open (event does not bubble to the trigger)", async () => {
    renderSelect({
      multiple: true,
      defaultValue: ['apple'],
      renderValue: (selectedOptions, { removeOption }) => (
        <div>
          {selectedOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeOption(option);
              }}
            >
              Remove {option.label}
            </button>
          ))}
        </div>
      ),
    });

    await user.click(screen.getByRole('button', { name: 'Remove Apple' }));

    expect(queryListbox()).not.toBeInTheDocument();
  });
});
