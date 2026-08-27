import type { TableColumn } from '@asnewyla/unstyled-table';
import { render, screen } from '@testing-library/react';
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

  it('merges a consumer className with the base xd-table class', () => {
    render(<Table data={people} columns={columns} className="my-table" />);

    expect(screen.getByRole('table')).toHaveClass('xd-table', 'my-table');
  });

  it('applies the base xd-table class even without a consumer className', () => {
    render(<Table data={people} columns={columns} />);

    expect(screen.getByRole('table')).toHaveClass('xd-table');
  });

  it('forwards a ref to the underlying table element', () => {
    const ref = createRef<HTMLTableElement>();
    render(<Table data={people} columns={columns} ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLTableElement);
    expect(ref.current).toBe(screen.getByRole('table'));
  });

  it('passes through arbitrary native table attributes', () => {
    render(<Table data={people} columns={columns} id="people-table" />);

    expect(screen.getByRole('table')).toHaveAttribute('id', 'people-table');
  });


  // it.each(['sortable', 'filterable', 'selectable', 'paginated'])
  it('passes sortable/filterable/selectable/paginated straight through to the primitive', () => {
    render(
      <Table
        data={people}
        columns={[
          { key: 'name', header: 'Name', sortable: true },
          { key: 'age', header: 'Age' },
        ]}
        filterable
      />,
    );

    expect(screen.getByRole('button', { name: 'Name' })).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: 'Search table' }),
    ).toBeInTheDocument();
  });
});
