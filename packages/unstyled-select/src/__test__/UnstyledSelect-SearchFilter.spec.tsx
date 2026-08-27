import userEvent, { type UserEvent } from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  clearQuery,
  closeSelect,
  getOption,
  getOptionLabels,
  getSearchInput,
  openSelect,
  queryOptionLabels,
  typeQuery,
} from '../test-utils';
import { fruitOptionsWithDisabled, renderSelect } from './fixtures';

let user: UserEvent;

beforeEach(() => {
  user = userEvent.setup();
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
