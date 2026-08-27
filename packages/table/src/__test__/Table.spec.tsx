import type { TableColumn } from '@asnewyla/unstyled-table';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Table } from '../components';

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

describe('Table', () => {
  it('renders a table, delegating to the unstyled primitive', () => {
    render(<Table data={people} columns={columns} />);

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(people.length + 1);
  });

  it('applies the base xd-table class even without a consumer className', () => {
    render(<Table data={people} columns={columns} />);

    expect(screen.getByRole('table')).toHaveClass('xd-table');
  });

  it('merges a consumer className with the base xd-table class, base class first', () => {
    render(<Table data={people} columns={columns} className="my-table" />);

    expect(screen.getByRole('table').className).toBe('xd-table my-table');
  });

  it('forwards a ref to the underlying table element', () => {
    const ref = createRef<HTMLTableElement>();
    render(<Table data={people} columns={columns} ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLTableElement);
    expect(ref.current).toBe(screen.getByRole('table'));
  });

  it('passes through arbitrary native table attributes', () => {
    render(<Table data={people} columns={columns} title="People" />);

    expect(screen.getByRole('table')).toHaveAttribute('title', 'People');
  });

  it('does not invent an id when none is provided', () => {
    render(<Table data={people} columns={columns} />);

    expect(screen.getByRole('table')).not.toHaveAttribute('id');
  });

  it('respects an explicitly-provided id', () => {
    render(<Table data={people} columns={columns} id="people-table" />);

    expect(screen.getByRole('table')).toHaveAttribute('id', 'people-table');
  });

  it('passes a sortable column straight through — renders a sort button', () => {
    const sortableColumns: TableColumn<Person>[] = [
      { key: 'name', header: 'Name', sortable: true },
      { key: 'age', header: 'Age' },
    ];
    render(<Table data={people} columns={sortableColumns} />);

    expect(screen.getByRole('button', { name: 'Name' })).toBeInTheDocument();
  });

  it('passes filterable straight through — renders a search input', () => {
    render(<Table data={people} columns={columns} filterable />);

    expect(
      screen.getByRole('textbox', { name: 'Search table' }),
    ).toBeInTheDocument();
  });

  it('passes selectable straight through — renders a row checkbox per row plus select-all', () => {
    render(
      <Table
        data={people}
        columns={columns}
        selectable
        getRowKey={(row: Person) => row.id}
      />,
    );

    expect(screen.getAllByRole('checkbox')).toHaveLength(people.length + 1);
  });

  it('passes paginated straight through — renders pagination controls', () => {
    render(<Table data={people} columns={columns} paginated pageSize={1} />);

    expect(
      screen.getByRole('button', { name: 'Next page' }),
    ).toBeInTheDocument();
  });

  it('actually sorts data when the sort button is clicked, like the primitive', async () => {
    const user = userEvent.setup();
    const reversed: Person[] = [people[1], people[0]];
    const sortableColumns: TableColumn<Person>[] = [
      { key: 'name', header: 'Name', sortable: true },
      { key: 'age', header: 'Age' },
    ];
    render(<Table data={reversed} columns={sortableColumns} />);

    const rowsBefore = screen.getAllByRole('row').slice(1);
    expect(rowsBefore[0]).toHaveTextContent('Alan Turing');

    await user.click(screen.getByRole('button', { name: 'Name' }));

    const rowsAfter = screen.getAllByRole('row').slice(1);
    expect(rowsAfter[0]).toHaveTextContent('Ada Lovelace');
    expect(rowsAfter[1]).toHaveTextContent('Alan Turing');
  });
});
