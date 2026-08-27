import userEvent, { type UserEvent } from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  clickOption,
  closeSelect,
  getCombobox,
  getListbox,
  getOption,
  getSearchInput,
  openSelect,
  queryListbox,
} from '../test-utils';
import { fruitOptionsWithDisabled, renderSelect } from './fixtures';

let user: UserEvent;

beforeEach(() => {
  user = userEvent.setup();
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
