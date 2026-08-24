import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { UnstyledSelect, type UnstyledSelectProps } from '../components';
import {
  clickOption,
  getCombobox,
  getListbox,
  getOption,
  getOptionLabels,
  openSelect,
  queryListbox,
} from '../test-utils';

const fruitOptions: UnstyledSelectProps['options'] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
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
