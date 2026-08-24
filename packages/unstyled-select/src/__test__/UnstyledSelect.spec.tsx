import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { UnstyledSelect } from '../components';

const fruitOptions = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
];

describe('UnstyledSelect — single-select core mechanics', () => {
  it('renders a combobox trigger', () => {
    render(<UnstyledSelect aria-label="Fruit" options={fruitOptions} />);

    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('is closed by default — no listbox in the document', () => {
    render(<UnstyledSelect aria-label="Fruit" options={fruitOptions} />);

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });

  it('shows placeholder text when nothing is selected', () => {
    render(
      <UnstyledSelect
        aria-label="Fruit"
        options={fruitOptions}
        placeholder="Choose a fruit"
      />,
    );

    expect(screen.getByRole('combobox')).toHaveTextContent('Choose a fruit');
  });

  it('opens the listbox and renders every option on click', async () => {
    const user = userEvent.setup();
    render(<UnstyledSelect aria-label="Fruit" options={fruitOptions} />);

    await user.click(screen.getByRole('combobox'));

    const listbox = screen.getByRole('listbox');
    const options = within(listbox).getAllByRole('option');
    expect(options).toHaveLength(3);
    expect(options.map((o) => o.textContent)).toEqual([
      'Apple',
      'Banana',
      'Cherry',
    ]);
    expect(screen.getByRole('combobox')).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('is uncontrolled by default — defaultValue shows the matching option label', () => {
    render(
      <UnstyledSelect
        aria-label="Fruit"
        options={fruitOptions}
        defaultValue="banana"
      />,
    );

    expect(screen.getByRole('combobox')).toHaveTextContent('Banana');
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

    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: 'Banana' }));

    expect(handleChange).toHaveBeenCalledWith('banana');
    expect(screen.getByRole('combobox')).toHaveTextContent('Banana');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
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

    await user.click(screen.getByRole('combobox'));

    expect(screen.getByRole('option', { name: 'Cherry' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByRole('option', { name: 'Apple' })).toHaveAttribute(
      'aria-selected',
      'false',
    );
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

    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: 'Banana' }));

    expect(handleChange).toHaveBeenCalledWith('banana');
    // still "apple" — nothing updated the value prop, matching every other
    // controlled component in this codebase
    expect(screen.getByRole('combobox')).toHaveTextContent('Apple');
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

    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: 'Durian' }));

    expect(handleChange).not.toHaveBeenCalled();
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('marks a disabled option with aria-disabled', async () => {
    const user = userEvent.setup();
    const options = [
      ...fruitOptions,
      { value: 'durian', label: 'Durian', disabled: true },
    ];
    render(<UnstyledSelect aria-label="Fruit" options={options} />);

    await user.click(screen.getByRole('combobox'));

    expect(screen.getByRole('option', { name: 'Durian' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
  });

  it('does not open when the whole select is disabled', async () => {
    const user = userEvent.setup();
    render(
      <UnstyledSelect aria-label="Fruit" options={fruitOptions} disabled />,
    );

    await user.click(screen.getByRole('combobox'));

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('sets aria-disabled on the trigger when disabled', () => {
    render(
      <UnstyledSelect aria-label="Fruit" options={fruitOptions} disabled />,
    );

    expect(screen.getByRole('combobox')).toHaveAttribute(
      'aria-disabled',
      'true',
    );
  });

  it('closes the listbox when clicking outside', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <UnstyledSelect aria-label="Fruit" options={fruitOptions} />
        <button type="button">Outside</button>
      </div>,
    );

    await user.click(screen.getByRole('combobox'));
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Outside' }));

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('closes the listbox on Escape', async () => {
    const user = userEvent.setup();
    render(<UnstyledSelect aria-label="Fruit" options={fruitOptions} />);

    await user.click(screen.getByRole('combobox'));
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    await user.keyboard('{Escape}');

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });
});
