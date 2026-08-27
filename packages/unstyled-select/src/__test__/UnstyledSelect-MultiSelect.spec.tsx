import userEvent, { type UserEvent } from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  clickOption,
  getCombobox,
  getListbox,
  getOption,
  openSelect,
} from '../test-utils';
import { fruitOptions, renderSelect } from './fixtures';

let user: UserEvent;

beforeEach(() => {
  user = userEvent.setup();
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
