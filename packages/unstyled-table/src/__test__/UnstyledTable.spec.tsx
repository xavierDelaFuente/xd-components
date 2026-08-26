import { render, screen, within } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { type TableColumn, UnstyledTable } from '../components';
import { getBodyRows, getTable } from '../test-utils';

let user: UserEvent;

beforeEach(() => {
  user = userEvent.setup();
});

interface Person {
  id: string;
  name: string;
  age: number;
}

const people: Person[] = [
  { id: '1', name: 'Ada Lovelace', age: 36 },
  { id: '2', name: 'Alan Turing', age: 41 },
];

const columns: TableColumn<Person>[] = [
  { key: 'name', header: 'Name' },
  { key: 'age', header: 'Age' },
];

describe('UnstyledTable', () => {
  it('renders a table', () => {
    render(<UnstyledTable data={people} columns={columns} />);

    expect(getTable()).toBeInTheDocument();
  });

  it("renders one column header per column, using each column's header text", () => {
    render(<UnstyledTable data={people} columns={columns} />);

    const headers = screen.getAllByRole('columnheader');
    expect(headers.map((h) => h.textContent)).toEqual(['Name', 'Age']);
  });

  it('renders one row per data item', () => {
    render(<UnstyledTable data={people} columns={columns} />);

    expect(getBodyRows()).toHaveLength(people.length);
  });

  it("renders each column's value from the row via the column's key by default", () => {
    render(<UnstyledTable data={people} columns={columns} />);
    const [firstRow] = getBodyRows();

    expect(
      within(firstRow).getByRole('cell', { name: 'Ada Lovelace' }),
    ).toBeInTheDocument();
    expect(
      within(firstRow).getByRole('cell', { name: '36' }),
    ).toBeInTheDocument();
  });

  it("renders a cell via a column's render function when provided, instead of the raw value", () => {
    const columnsWithRender: TableColumn<Person>[] = [
      { key: 'name', header: 'Name' },
      { key: 'age', header: 'Age', render: (row) => `${row.age} yrs` },
    ];
    render(<UnstyledTable data={people} columns={columnsWithRender} />);

    expect(screen.getByRole('cell', { name: '36 yrs' })).toBeInTheDocument();
  });

  it('renders no data rows when data is empty', () => {
    render(<UnstyledTable data={[]} columns={columns} />);

    expect(getBodyRows()).toHaveLength(0);
  });
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

  function getNameHeader() {
    return screen.getByRole('columnheader', { name: 'Name' });
  }

  function getNameSortButton() {
    return screen.getByRole('button', { name: 'Name' });
  }

  function namesInOrder(): string[] {
    return getBodyRows().map(
      (row) => within(row).getAllByRole('cell')[0].textContent,
    ) as string[];
  }

  it('renders a sortable column header as a button, unsorted by default', () => {
    render(<UnstyledTable data={unsortedPeople} columns={sortableColumns} />);

    expect(getNameSortButton()).toBeInTheDocument();
    expect(getNameHeader()).toHaveAttribute('aria-sort', 'none');
  });

  it('renders a non-sortable column header as plain text, not a button', () => {
    render(<UnstyledTable data={unsortedPeople} columns={sortableColumns} />);

    expect(
      screen.queryByRole('button', { name: 'Age' }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Age' }),
    ).not.toHaveAttribute('aria-sort');
  });

  it('sorts rows ascending by a column on first click, uncontrolled', async () => {
    render(<UnstyledTable data={unsortedPeople} columns={sortableColumns} />);

    await user.click(getNameSortButton());

    expect(namesInOrder()).toEqual([
      'Ada Lovelace',
      'Alan Turing',
      'Grace Hopper',
    ]);
    expect(getNameHeader()).toHaveAttribute('aria-sort', 'ascending');
  });

  it('sorts rows descending on a second click of the same column', async () => {
    render(<UnstyledTable data={unsortedPeople} columns={sortableColumns} />);
    const nameButton = getNameSortButton();

    await user.click(nameButton);
    await user.click(nameButton);

    expect(namesInOrder()).toEqual([
      'Grace Hopper',
      'Alan Turing',
      'Ada Lovelace',
    ]);
    expect(getNameHeader()).toHaveAttribute('aria-sort', 'descending');
  });

  it('clears sorting and restores original row order on a third click', async () => {
    render(<UnstyledTable data={unsortedPeople} columns={sortableColumns} />);
    const nameButton = getNameSortButton();

    await user.click(nameButton);
    await user.click(nameButton);
    await user.click(nameButton);

    expect(namesInOrder()).toEqual([
      'Alan Turing',
      'Grace Hopper',
      'Ada Lovelace',
    ]);
    expect(getNameHeader()).toHaveAttribute('aria-sort', 'none');
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

    await user.click(getNameSortButton());

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
    expect(getNameHeader()).toHaveAttribute('aria-sort', 'descending');
  });
});
