import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { UnstyledSelect, type UnstyledSelectProps } from '../components';
import {
  clickOption,
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

describe('UnstyledSelect — single-select core mechanics', () => {
  it('renders a combobox trigger', () => {
    render(<UnstyledSelect aria-label="Fruit" options={fruitOptions} />);

    expect(getCombobox()).toBeInTheDocument();
  });

  it('is closed by default — no listbox in the document', () => {
    render(<UnstyledSelect aria-label="Fruit" options={fruitOptions} />);

    expect(queryListbox()).not.toBeInTheDocument();
    expect(getCombobox()).toHaveAttribute('aria-expanded', 'false');
  });

  it('shows placeholder text when nothing is selected', () => {
    render(
      <UnstyledSelect
        aria-label="Fruit"
        options={fruitOptions}
        placeholder="Choose a fruit"
      />,
    );

    expect(getCombobox()).toHaveTextContent('Choose a fruit');
  });

  it('opens the listbox and renders every option on click', async () => {
    const user = userEvent.setup();
    render(<UnstyledSelect aria-label="Fruit" options={fruitOptions} />);

    await openSelect(user);

    expect(getOptionLabels()).toEqual(['Apple', 'Banana', 'Cherry']);
    expect(getCombobox()).toHaveAttribute('aria-expanded', 'true');
  });

  it('is uncontrolled by default — defaultValue shows the matching option label', () => {
    render(
      <UnstyledSelect
        aria-label="Fruit"
        options={fruitOptions}
        defaultValue="banana"
      />,
    );

    expect(getCombobox()).toHaveTextContent('Banana');
  });

  it('clicking an option selects it, calls onChange, and closes the listbox', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <UnstyledSelect
        aria-label="Fruit"
        options={fruitOptions}
        onChange={handleChange}
      />,
    );

    await openSelect(user);
    await clickOption(user, 'Banana');

    expect(handleChange).toHaveBeenCalledWith('banana');
    expect(getCombobox()).toHaveTextContent('Banana');
    expect(queryListbox()).not.toBeInTheDocument();
  });

  it('marks the currently selected option with aria-selected', async () => {
    const user = userEvent.setup();
    render(
      <UnstyledSelect
        aria-label="Fruit"
        options={fruitOptions}
        defaultValue="cherry"
      />,
    );

    await openSelect(user);

    expect(getOption('Cherry')).toHaveAttribute('aria-selected', 'true');
    expect(getOption('Apple')).toHaveAttribute('aria-selected', 'false');
  });

  it('supports controlled usage via value + onChange', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <UnstyledSelect
        aria-label="Fruit"
        options={fruitOptions}
        value="apple"
        onChange={handleChange}
      />,
    );

    await openSelect(user);
    await clickOption(user, 'Banana');

    expect(handleChange).toHaveBeenCalledWith('banana');
    expect(getCombobox()).toHaveTextContent('Apple');
  });

  it('does not select or close when clicking a disabled option', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const options = [
      ...fruitOptions,
      { value: 'durian', label: 'Durian', disabled: true },
    ];
    render(
      <UnstyledSelect
        aria-label="Fruit"
        options={options}
        onChange={handleChange}
      />,
    );

    await openSelect(user);
    await clickOption(user, 'Durian');

    expect(handleChange).not.toHaveBeenCalled();
    expect(getListbox()).toBeInTheDocument();
  });

  it('marks a disabled option with aria-disabled', async () => {
    const user = userEvent.setup();
    const options = [
      ...fruitOptions,
      { value: 'durian', label: 'Durian', disabled: true },
    ];
    render(<UnstyledSelect aria-label="Fruit" options={options} />);

    await openSelect(user);

    expect(getOption('Durian')).toHaveAttribute('aria-disabled', 'true');
  });

  it('does not open when the whole select is disabled', async () => {
    const user = userEvent.setup();
    render(
      <UnstyledSelect aria-label="Fruit" options={fruitOptions} disabled />,
    );

    await openSelect(user);

    expect(queryListbox()).not.toBeInTheDocument();
  });

  it('sets aria-disabled on the trigger when disabled', () => {
    render(
      <UnstyledSelect aria-label="Fruit" options={fruitOptions} disabled />,
    );

    expect(getCombobox()).toHaveAttribute('aria-disabled', 'true');
  });

  it('closes the listbox when clicking outside', async () => {
    const user = userEvent.setup();
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
    const user = userEvent.setup();
    render(<UnstyledSelect aria-label="Fruit" options={fruitOptions} />);

    await openSelect(user);
    expect(getListbox()).toBeInTheDocument();

    await user.keyboard('{Escape}');

    expect(queryListbox()).not.toBeInTheDocument();
  });

  it('forwards a ref to the trigger element', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <UnstyledSelect aria-label="Fruit" options={fruitOptions} ref={ref} />,
    );

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current).toBe(getCombobox());
  });

  it('passes through arbitrary native button attributes', () => {
    render(
      <UnstyledSelect aria-label="Fruit" options={fruitOptions} name="fruit" />,
    );

    expect(getCombobox()).toHaveAttribute('name', 'fruit');
  });
});

describe('UnstyledSelect — multi-select', () => {
  it('marks the listbox aria-multiselectable when multiple', async () => {
    const user = userEvent.setup();
    render(
      <UnstyledSelect aria-label="Fruit" options={fruitOptions} multiple />,
    );

    await openSelect(user);

    expect(getListbox()).toHaveAttribute('aria-multiselectable', 'true');
  });

  it('shows placeholder text when nothing is selected', () => {
    render(
      <UnstyledSelect
        aria-label="Fruit"
        options={fruitOptions}
        multiple
        placeholder="Choose fruits"
      />,
    );

    expect(getCombobox()).toHaveTextContent('Choose fruits');
  });

  it('is uncontrolled by default — defaultValue shows every selected label', () => {
    render(
      <UnstyledSelect
        aria-label="Fruit"
        options={fruitOptions}
        multiple
        defaultValue={['apple', 'cherry']}
      />,
    );
    const trigger = getCombobox();

    expect(trigger).toHaveTextContent('Apple');
    expect(trigger).toHaveTextContent('Cherry');
  });

  it('clicking an unselected option adds it, calls onChange with the full array, and keeps the listbox open', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <UnstyledSelect
        aria-label="Fruit"
        options={fruitOptions}
        multiple
        defaultValue={['apple']}
        onChange={handleChange}
      />,
    );

    await openSelect(user);
    await clickOption(user, 'Banana');

    expect(handleChange).toHaveBeenCalledWith(['apple', 'banana']);
    expect(getListbox()).toBeInTheDocument();
  });

  it('clicking an already-selected option removes it from the value', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <UnstyledSelect
        aria-label="Fruit"
        options={fruitOptions}
        multiple
        defaultValue={['apple', 'banana']}
        onChange={handleChange}
      />,
    );

    await openSelect(user);
    await clickOption(user, 'Apple');

    expect(handleChange).toHaveBeenCalledWith(['banana']);
  });

  it('shows the placeholder again once every selection is removed (uncontrolled)', async () => {
    const user = userEvent.setup();
    render(
      <UnstyledSelect
        aria-label="Fruit"
        options={fruitOptions}
        multiple
        defaultValue={['apple']}
        placeholder="Choose fruits"
      />,
    );

    await openSelect(user);
    await clickOption(user, 'Apple');

    expect(getCombobox()).toHaveTextContent('Choose fruits');
  });

  it('marks every selected option with aria-selected, not just one', async () => {
    const user = userEvent.setup();
    render(
      <UnstyledSelect
        aria-label="Fruit"
        options={fruitOptions}
        multiple
        defaultValue={['apple', 'cherry']}
      />,
    );

    await openSelect(user);

    expect(getOption('Apple')).toHaveAttribute('aria-selected', 'true');
    expect(getOption('Cherry')).toHaveAttribute('aria-selected', 'true');
    expect(getOption('Banana')).toHaveAttribute('aria-selected', 'false');
  });

  it('supports controlled usage via value + onChange', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <UnstyledSelect
        aria-label="Fruit"
        options={fruitOptions}
        multiple
        value={['apple']}
        onChange={handleChange}
      />,
    );

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
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const options = [
      ...fruitOptions,
      { value: 'durian', label: 'Durian', disabled: true },
    ];
    render(
      <UnstyledSelect
        aria-label="Fruit"
        options={options}
        multiple
        defaultValue={['apple']}
        onChange={handleChange}
      />,
    );

    await openSelect(user);
    await clickOption(user, 'Durian');

    expect(handleChange).not.toHaveBeenCalled();
  });
});

describe('UnstyledSelect — keyboard navigation', () => {
  it('focuses the search input when opened', async () => {
    const user = userEvent.setup();
    render(<UnstyledSelect aria-label="Fruit" options={fruitOptions} />);

    await openSelect(user);

    expect(getSearchInput()).toHaveFocus();
  });

  it('ArrowDown from the search input moves focus to the first option', async () => {
    const user = userEvent.setup();
    render(<UnstyledSelect aria-label="Fruit" options={fruitOptions} />);

    await openSelect(user);
    await user.keyboard('{ArrowDown}');

    expect(getOption('Apple')).toHaveFocus();
  });

  it('ArrowUp from the first option moves focus back to the search input', async () => {
    const user = userEvent.setup();
    render(<UnstyledSelect aria-label="Fruit" options={fruitOptions} />);

    await openSelect(user);
    await user.keyboard('{ArrowDown}{ArrowUp}');

    expect(getSearchInput()).toHaveFocus();
  });

  it('ArrowDown moves focus to the next option', async () => {
    const user = userEvent.setup();
    render(<UnstyledSelect aria-label="Fruit" options={fruitOptions} />);

    await openSelect(user);
    await user.keyboard('{ArrowDown}{ArrowDown}');

    expect(getOption('Banana')).toHaveFocus();
  });

  it('ArrowUp moves focus to the previous option', async () => {
    const user = userEvent.setup();
    render(<UnstyledSelect aria-label="Fruit" options={fruitOptions} />);

    await openSelect(user);
    await user.keyboard('{ArrowDown}{ArrowDown}{ArrowUp}');

    expect(getOption('Apple')).toHaveFocus();
  });

  it('ArrowDown does not move past the last option', async () => {
    const user = userEvent.setup();
    render(<UnstyledSelect aria-label="Fruit" options={fruitOptions} />);

    await openSelect(user);
    await user.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}{ArrowDown}');

    expect(getOption('Cherry')).toHaveFocus();
  });

  it('ArrowDown skips a disabled option', async () => {
    const user = userEvent.setup();
    render(
      <UnstyledSelect aria-label="Fruit" options={fruitOptionsWithDisabled} />,
    );

    await openSelect(user);
    await user.keyboard('{ArrowDown}{ArrowDown}');

    expect(getOption('Cherry')).toHaveFocus();
  });

  it('ArrowUp skips a disabled option', async () => {
    const user = userEvent.setup();
    render(
      <UnstyledSelect aria-label="Fruit" options={fruitOptionsWithDisabled} />,
    );

    await openSelect(user);
    await user.keyboard('{End}{ArrowUp}');

    expect(getOption('Apple')).toHaveFocus();
  });

  it('Home moves focus to the first enabled option', async () => {
    const user = userEvent.setup();
    render(<UnstyledSelect aria-label="Fruit" options={fruitOptions} />);

    await openSelect(user);
    await user.keyboard('{ArrowDown}{ArrowDown}{Home}');

    expect(getOption('Apple')).toHaveFocus();
  });

  it('End moves focus to the last enabled option', async () => {
    const user = userEvent.setup();
    render(<UnstyledSelect aria-label="Fruit" options={fruitOptions} />);

    await openSelect(user);
    await user.keyboard('{End}');

    expect(getOption('Cherry')).toHaveFocus();
  });

  it('Enter selects the focused option and closes the listbox (single-select)', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <UnstyledSelect
        aria-label="Fruit"
        options={fruitOptions}
        onChange={handleChange}
      />,
    );

    await openSelect(user);
    await user.keyboard('{ArrowDown}{ArrowDown}{Enter}');

    expect(handleChange).toHaveBeenCalledWith('banana');
    expect(queryListbox()).not.toBeInTheDocument();
  });

  it('in multi-select mode, Enter toggles the focused option without closing the listbox', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <UnstyledSelect
        aria-label="Fruit"
        options={fruitOptions}
        multiple
        onChange={handleChange}
      />,
    );

    await openSelect(user);
    await user.keyboard('{ArrowDown}{Enter}');

    expect(handleChange).toHaveBeenCalledWith(['apple']);
    expect(getListbox()).toBeInTheDocument();
    expect(getOption('Apple')).toHaveFocus();
  });

  it('closing via Escape returns focus to the trigger', async () => {
    const user = userEvent.setup();
    render(<UnstyledSelect aria-label="Fruit" options={fruitOptions} />);

    await openSelect(user);
    await user.keyboard('{Escape}');

    expect(getCombobox()).toHaveFocus();
  });

  it('closing via selecting an option returns focus to the trigger (single-select)', async () => {
    const user = userEvent.setup();
    render(<UnstyledSelect aria-label="Fruit" options={fruitOptions} />);

    await openSelect(user);
    await clickOption(user, 'Banana');

    expect(getCombobox()).toHaveFocus();
  });
});

describe('UnstyledSelect — search / filter', () => {
  it('renders a search input inside the popup when opened', async () => {
    const user = userEvent.setup();
    render(<UnstyledSelect aria-label="Fruit" options={fruitOptions} />);

    await openSelect(user);

    expect(getSearchInput()).toBeInTheDocument();
  });

  it('the search input starts empty when the listbox opens', async () => {
    const user = userEvent.setup();
    render(<UnstyledSelect aria-label="Fruit" options={fruitOptions} />);

    await openSelect(user);

    expect(getSearchInput()).toHaveValue('');
  });

  it('typing filters the rendered options by label, case-insensitively', async () => {
    const user = userEvent.setup();
    render(<UnstyledSelect aria-label="Fruit" options={fruitOptions} />);

    await openSelect(user);
    await typeQuery(user, 'AN');

    expect(getOptionLabels()).toEqual(['Banana']);
  });

  it('shows no options when the query matches nothing', async () => {
    const user = userEvent.setup();
    render(<UnstyledSelect aria-label="Fruit" options={fruitOptions} />);

    await openSelect(user);
    await typeQuery(user, 'xyz');

    expect(queryOptionLabels()).toEqual([]);
  });

  it('clearing the query shows every option again', async () => {
    const user = userEvent.setup();
    render(<UnstyledSelect aria-label="Fruit" options={fruitOptions} />);

    await openSelect(user);
    await typeQuery(user, 'an');
    await user.clear(getSearchInput());

    expect(getOptionLabels()).toEqual(['Apple', 'Banana', 'Cherry']);
  });

  it('keyboard navigation operates over the filtered results, not the full list', async () => {
    const user = userEvent.setup();
    render(<UnstyledSelect aria-label="Fruit" options={fruitOptions} />);

    await openSelect(user);
    await typeQuery(user, 'a');
    await user.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}');

    // "Cherry" doesn't match "a" and is filtered out, so ArrowDown clamps
    // at "Banana" (the last filtered result) rather than reaching it
    expect(getOption('Banana')).toHaveFocus();
  });

  it('selecting a filtered option selects the right value', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <UnstyledSelect
        aria-label="Fruit"
        options={fruitOptions}
        onChange={handleChange}
      />,
    );

    await openSelect(user);
    await typeQuery(user, 'an');
    await user.keyboard('{ArrowDown}{Enter}');

    expect(handleChange).toHaveBeenCalledWith('banana');
  });

  it('resets the query when the listbox closes without selecting (Escape)', async () => {
    const user = userEvent.setup();
    render(<UnstyledSelect aria-label="Fruit" options={fruitOptions} />);

    await openSelect(user);
    await typeQuery(user, 'an');
    await user.keyboard('{Escape}');
    await openSelect(user);

    expect(getSearchInput()).toHaveValue('');
    expect(getOptionLabels()).toEqual(['Apple', 'Banana', 'Cherry']);
  });

  it('resets the query after selecting an option (single-select)', async () => {
    const user = userEvent.setup();
    render(<UnstyledSelect aria-label="Fruit" options={fruitOptions} />);

    await openSelect(user);
    await typeQuery(user, 'an');
    await user.keyboard('{ArrowDown}{Enter}');
    await openSelect(user);

    expect(getSearchInput()).toHaveValue('');
    expect(getOptionLabels()).toEqual(['Apple', 'Banana', 'Cherry']);
  });

  it('a disabled option matching the query still shows aria-disabled', async () => {
    const user = userEvent.setup();
    render(
      <UnstyledSelect aria-label="Fruit" options={fruitOptionsWithDisabled} />,
    );

    await openSelect(user);
    await typeQuery(user, 'ban');

    expect(getOption('Banana')).toHaveAttribute('aria-disabled', 'true');
  });

  it('multi-select also supports search filtering', async () => {
    const user = userEvent.setup();
    render(
      <UnstyledSelect aria-label="Fruit" options={fruitOptions} multiple />,
    );

    await openSelect(user);
    await typeQuery(user, 'an');

    expect(getOptionLabels()).toEqual(['Banana']);
  });
});
