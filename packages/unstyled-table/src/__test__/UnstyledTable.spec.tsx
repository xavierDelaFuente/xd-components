import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { type TableColumn, UnstyledTable } from '../components';
import { getBodyRows, getTable } from '../test-utils';
import { columns, type Person, people } from './fixtures';

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
