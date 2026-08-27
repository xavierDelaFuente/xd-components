import { clickOption, openSelect } from '@asnewyla/unstyled-select/test-utils';
import { render, screen } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import { createRef } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Select } from '../components';
import { fruitOptions } from './fixtures';

let user: UserEvent;

beforeEach(() => {
  user = userEvent.setup();
});

describe('Select', () => {
  it('renders the label text', () => {
    render(<Select label="Fruit" options={fruitOptions} />);

    expect(screen.getByText('Fruit')).toBeInTheDocument();
  });

  it('gives the trigger an accessible name via aria-labelledby, not htmlFor', () => {
    render(<Select label="Fruit" options={fruitOptions} />);

    expect(screen.getByRole('combobox', { name: 'Fruit' })).toBeInTheDocument();
  });

  it('auto-generates a unique id when none is provided', () => {
    render(
      <>
        <Select label="Fruit" options={fruitOptions} />
        <Select label="Veggie" options={fruitOptions} />
      </>,
    );

    const first = screen.getByRole('combobox', { name: 'Fruit' });
    const last = screen.getByRole('combobox', { name: 'Veggie' });

    expect(first.id).toBeTruthy();
    expect(last.id).toBeTruthy();
    expect(first.id).not.toBe(last.id);
  });

  it('respects an explicitly-provided id', () => {
    render(<Select label="Fruit" options={fruitOptions} id="custom-id" />);

    expect(screen.getByRole('combobox', { name: 'Fruit' })).toHaveAttribute(
      'id',
      'custom-id',
    );
  });

  it('renders no error message when error is not provided', () => {
    render(<Select label="Fruit" options={fruitOptions} />);

    expect(screen.queryByRole('combobox')).not.toHaveAttribute(
      'aria-describedby',
    );
  });

  it('renders the error message text and marks the trigger invalid when error is provided', () => {
    render(
      <Select label="Fruit" options={fruitOptions} error="Pick a fruit" />,
    );

    expect(screen.getByText('Pick a fruit')).toBeInTheDocument();
    const trigger = screen.getByRole('combobox', { name: 'Fruit' });
    expect(trigger).toHaveAttribute('aria-invalid', 'true');
    expect(trigger).toHaveAttribute('data-invalid', 'true');
  });

  it('links the trigger to the error message via aria-describedby', () => {
    render(
      <Select label="Fruit" options={fruitOptions} error="Pick a fruit" />,
    );

    const trigger = screen.getByRole('combobox', { name: 'Fruit' });
    const describedById = trigger.getAttribute('aria-describedby');

    expect(describedById).toBeTruthy();
    expect(document.getElementById(describedById as string)).toHaveTextContent(
      'Pick a fruit',
    );
  });

  it('forwards disabled to the underlying trigger', () => {
    render(<Select label="Fruit" options={fruitOptions} disabled />);

    expect(screen.getByRole('combobox', { name: 'Fruit' })).toHaveAttribute(
      'data-disabled',
      'true',
    );
  });

  it('merges a consumer className with the base xd-select-trigger class', () => {
    render(
      <Select label="Fruit" options={fruitOptions} className="my-select" />,
    );

    expect(screen.getByRole('combobox', { name: 'Fruit' })).toHaveClass(
      'xd-select-trigger',
      'my-select',
    );
  });

  it('forwards a ref to the trigger element', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Select label="Fruit" options={fruitOptions} ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toBe(screen.getByRole('combobox', { name: 'Fruit' }));
  });

  it('passes through arbitrary native div attributes', () => {
    render(
      <Select label="Fruit" options={fruitOptions} title="Choose a fruit" />,
    );

    expect(screen.getByRole('combobox', { name: 'Fruit' })).toHaveAttribute(
      'title',
      'Choose a fruit',
    );
  });

  it('opens the listbox and selects an option like the primitive', async () => {
    const handleChange = vi.fn();
    render(
      <Select label="Fruit" options={fruitOptions} onChange={handleChange} />,
    );

    await openSelect(user);
    await clickOption(user, 'Banana');

    expect(handleChange).toHaveBeenCalledWith('banana');
  });

  it('shows the selected label as plain text (single-select, no chips)', () => {
    render(
      <Select label="Fruit" options={fruitOptions} defaultValue="banana" />,
    );

    const trigger = screen.getByRole('combobox', { name: 'Fruit' });
    expect(trigger).toHaveTextContent('Banana');
    expect(trigger.querySelector('.xd-select-chip')).toBeNull();
  });
});
