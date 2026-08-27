import { render, screen } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import { createRef } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UnstyledSelect } from '../components';
import {
  clickOption,
  closeSelect,
  getCombobox,
  getListbox,
  getOption,
  getOptionLabels,
  getSearchInput,
  openSelect,
  queryListbox,
} from '../test-utils';
import { fruitOptions, renderSelect } from './fixtures';

let user: UserEvent;

beforeEach(() => {
  user = userEvent.setup();
});

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
