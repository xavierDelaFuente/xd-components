import {
  clickOption,
  getOption,
  openSelect,
} from '@asnewyla/unstyled-select/test-utils';
import { render, screen } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Select } from '../components';
import { fruitOptions } from './fixtures';

let user: UserEvent;

beforeEach(() => {
  user = userEvent.setup();
});

describe('Select — multi-select chips', () => {
  it('renders each selected option as a chip', () => {
    render(
      <Select
        label="Fruit"
        options={fruitOptions}
        multiple
        defaultValue={['apple', 'banana']}
      />,
    );

    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByText('Banana')).toBeInTheDocument();
    expect(
      screen
        .getByRole('combobox', { name: 'Fruit' })
        .querySelectorAll('.xd-select-chip'),
    ).toHaveLength(2);
  });

  it('shows the placeholder when nothing is selected (multi-select)', () => {
    render(
      <Select
        label="Fruit"
        options={fruitOptions}
        multiple
        placeholder="Choose fruits"
      />,
    );

    expect(screen.getByRole('combobox', { name: 'Fruit' })).toHaveTextContent(
      'Choose fruits',
    );
  });

  it('each chip has a real, focusable remove button', () => {
    render(
      <Select
        label="Fruit"
        options={fruitOptions}
        multiple
        defaultValue={['apple']}
      />,
    );

    expect(
      screen.getByRole('button', { name: 'Remove Apple' }),
    ).toBeInTheDocument();
  });

  it('clicking a chip remove button deselects it and calls onChange, without opening the listbox', async () => {
    const handleChange = vi.fn();
    render(
      <Select
        label="Fruit"
        options={fruitOptions}
        multiple
        defaultValue={['apple', 'banana']}
        onChange={handleChange}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Remove Apple' }));

    expect(handleChange).toHaveBeenCalledWith(['banana']);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('removing a chip does not remove the others', async () => {
    render(
      <Select
        label="Fruit"
        options={fruitOptions}
        multiple
        defaultValue={['apple', 'banana', 'cherry']}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Remove Banana' }));

    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByText('Cherry')).toBeInTheDocument();
    expect(screen.queryByText('Banana')).not.toBeInTheDocument();
  });

  it('still allows opening the listbox and selecting more options via the primitive', async () => {
    const handleChange = vi.fn();
    render(
      <Select
        label="Fruit"
        options={fruitOptions}
        multiple
        defaultValue={['apple']}
        onChange={handleChange}
      />,
    );

    await openSelect(user);
    await clickOption(user, 'Cherry');

    expect(handleChange).toHaveBeenCalledWith(['apple', 'cherry']);
  });

  it('an option matching a chip still shows aria-selected in the listbox', async () => {
    render(
      <Select
        label="Fruit"
        options={fruitOptions}
        multiple
        defaultValue={['apple']}
      />,
    );

    await openSelect(user);

    expect(getOption('Apple')).toHaveAttribute('aria-selected', 'true');
  });
});
