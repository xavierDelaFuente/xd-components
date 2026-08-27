import { render, screen, within } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { type TableColumn, UnstyledTable } from '../components';
import { getBodyRows, getSearchInput, getSortButton } from '../test-utils';
import { columns, type Person, people } from './fixtures';

let user: UserEvent;

beforeEach(() => {
  user = userEvent.setup();
});

describe('UnstyledTable filtering', () => {
  it('does not render a search input by default', () => {
    render(<UnstyledTable data={people} columns={columns} />);

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('renders a search input when filterable', () => {
    render(<UnstyledTable data={people} columns={columns} filterable />);

    expect(getSearchInput()).toBeInTheDocument();
  });

  it('shows all rows when the search query is empty', () => {
    render(<UnstyledTable data={people} columns={columns} filterable />);

    expect(getBodyRows()).toHaveLength(people.length);
  });

  it('filters rows by a case-insensitive substring match against any column value', async () => {
    render(<UnstyledTable data={people} columns={columns} filterable />);

    await user.type(getSearchInput(), 'ada');

    const rows = getBodyRows();
    expect(rows).toHaveLength(1);
    expect(
      within(rows[0]).getByRole('cell', { name: 'Ada Lovelace' }),
    ).toBeInTheDocument();
  });

  it('matches against a numeric column value too', async () => {
    render(<UnstyledTable data={people} columns={columns} filterable />);

    await user.type(getSearchInput(), '41');

    const rows = getBodyRows();
    expect(rows).toHaveLength(1);
    expect(
      within(rows[0]).getByRole('cell', { name: 'Alan Turing' }),
    ).toBeInTheDocument();
  });

  it('renders no rows when nothing matches the query', async () => {
    render(<UnstyledTable data={people} columns={columns} filterable />);

    await user.type(getSearchInput(), 'zzz');

    expect(getBodyRows()).toHaveLength(0);
  });

  it('filters first, then sorts the remaining rows', async () => {
    const threePeople: Person[] = [
      { id: '1', name: 'Zoe', age: 50 },
      { id: '2', name: 'Amy', age: 40 },
      { id: '3', name: 'Bob', age: 30 },
    ];
    const sortableColumns: TableColumn<Person>[] = [
      { key: 'name', header: 'Name', sortable: true },
      { key: 'age', header: 'Age' },
    ];
    render(
      <UnstyledTable data={threePeople} columns={sortableColumns} filterable />,
    );

    // 'o' matches Zoe and Bob, not Amy
    await user.type(getSearchInput(), 'o');
    await user.click(getSortButton('Name'));

    const rows = getBodyRows();
    expect(rows).toHaveLength(2);
    expect(
      within(rows[0]).getByRole('cell', { name: 'Bob' }),
    ).toBeInTheDocument();
    expect(
      within(rows[1]).getByRole('cell', { name: 'Zoe' }),
    ).toBeInTheDocument();
  });
});
