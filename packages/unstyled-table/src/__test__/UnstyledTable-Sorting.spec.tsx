import { render, screen } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { type TableColumn, UnstyledTable } from '../components';
import { getColumnHeader, getSortButton, namesInOrder } from '../test-utils';
import type { Person } from './fixtures';

let user: UserEvent;

beforeEach(() => {
  user = userEvent.setup();
});

describe('UnstyledTable sorting', () => {
  // deliberately not sorted, and not the reverse of sorted either, so
  // "ascending", "descending", and "original order" are all distinguishable
  const unsortedPeople: Person[] = [
    { id: '2', name: 'Alan Turing', age: 41 },
    { id: '3', name: 'Grace Hopper', age: 85 },
    { id: '1', name: 'Ada Lovelace', age: 36 },
  ];

  const sortableColumns: TableColumn<Person>[] = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'age', header: 'Age' },
  ];

  it('renders a sortable column header as a button, unsorted by default', () => {
    render(<UnstyledTable data={unsortedPeople} columns={sortableColumns} />);

    expect(getSortButton('Name')).toBeInTheDocument();
    expect(getColumnHeader('Name')).toHaveAttribute('aria-sort', 'none');
  });

  it('renders a non-sortable column header as plain text, not a button', () => {
    render(<UnstyledTable data={unsortedPeople} columns={sortableColumns} />);

    expect(
      screen.queryByRole('button', { name: 'Age' }),
    ).not.toBeInTheDocument();
    expect(getColumnHeader('Age')).not.toHaveAttribute('aria-sort');
  });

  it('sorts rows ascending by a column on first click, uncontrolled', async () => {
    render(<UnstyledTable data={unsortedPeople} columns={sortableColumns} />);

    await user.click(getSortButton('Name'));

    expect(namesInOrder()).toEqual([
      'Ada Lovelace',
      'Alan Turing',
      'Grace Hopper',
    ]);
    expect(getColumnHeader('Name')).toHaveAttribute('aria-sort', 'ascending');
  });

  it('sorts rows descending on a second click of the same column', async () => {
    render(<UnstyledTable data={unsortedPeople} columns={sortableColumns} />);
    const nameButton = getSortButton('Name');

    await user.click(nameButton);
    await user.click(nameButton);

    expect(namesInOrder()).toEqual([
      'Grace Hopper',
      'Alan Turing',
      'Ada Lovelace',
    ]);
    expect(getColumnHeader('Name')).toHaveAttribute('aria-sort', 'descending');
  });

  it('clears sorting and restores original row order on a third click', async () => {
    render(<UnstyledTable data={unsortedPeople} columns={sortableColumns} />);
    const nameButton = getSortButton('Name');

    await user.click(nameButton);
    await user.click(nameButton);
    await user.click(nameButton);

    expect(namesInOrder()).toEqual([
      'Alan Turing',
      'Grace Hopper',
      'Ada Lovelace',
    ]);
    expect(getColumnHeader('Name')).toHaveAttribute('aria-sort', 'none');
  });

  it('supports controlled sorting via sort + onSortChange, without reordering internally', async () => {
    const handleSortChange = vi.fn();
    render(
      <UnstyledTable
        data={unsortedPeople}
        columns={sortableColumns}
        sort={null}
        onSortChange={handleSortChange}
      />,
    );

    await user.click(getSortButton('Name'));

    expect(handleSortChange).toHaveBeenCalledWith({
      key: 'name',
      direction: 'asc',
    });
    // still original order — nothing fed the new sort back in via props
    expect(namesInOrder()).toEqual([
      'Alan Turing',
      'Grace Hopper',
      'Ada Lovelace',
    ]);
  });

  it('reflects an externally-controlled sort value in aria-sort and row order', () => {
    render(
      <UnstyledTable
        data={unsortedPeople}
        columns={sortableColumns}
        sort={{ key: 'name', direction: 'desc' }}
        onSortChange={vi.fn()}
      />,
    );

    expect(namesInOrder()).toEqual([
      'Grace Hopper',
      'Alan Turing',
      'Ada Lovelace',
    ]);
    expect(getColumnHeader('Name')).toHaveAttribute('aria-sort', 'descending');
  });
});
