import { render, screen, within } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { type TableColumn, UnstyledTable } from '../components';
import {
  getBodyRows,
  getColumnHeader,
  getNextPageButton,
  getPreviousPageButton,
  getRowCheckbox,
  getSearchInput,
  getSelectAllCheckbox,
  getSortButton,
  getTable,
  namesInOrder,
} from '../test-utils';

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

describe('UnstyledTable row identity', () => {
  // deliberately not sorted, so triggering a sort actually reorders rows
  const unsortedPeople: Person[] = [
    { id: '2', name: 'Bob', age: 41 },
    { id: '1', name: 'Ada', age: 36 },
  ];

  const columnsWithInput: TableColumn<Person>[] = [
    { key: 'name', header: 'Name', sortable: true },
    {
      key: 'age',
      header: 'Note',
      render: (row) => <input aria-label={`Note for ${row.name}`} />,
    },
  ];

  it('keeps each row’s own DOM state attached to that row when a sort reorders the rows', async () => {
    render(<UnstyledTable data={unsortedPeople} columns={columnsWithInput} />);

    await user.type(
      screen.getByRole('textbox', { name: 'Note for Bob' }),
      'bob-note',
    );
    await user.type(
      screen.getByRole('textbox', { name: 'Note for Ada' }),
      'ada-note',
    );

    // sorting ascending by name reorders the rows: Ada first, then Bob
    await user.click(getSortButton('Name'));

    expect(screen.getByRole('textbox', { name: 'Note for Ada' })).toHaveValue(
      'ada-note',
    );
    expect(screen.getByRole('textbox', { name: 'Note for Bob' })).toHaveValue(
      'bob-note',
    );
  });
});

describe('UnstyledTable selection', () => {
  const selectionPeople: Person[] = [
    { id: '1', name: 'Ada Lovelace', age: 36 },
    { id: '2', name: 'Alan Turing', age: 41 },
    { id: '3', name: 'Grace Hopper', age: 85 },
  ];

  it('does not render any checkboxes by default', () => {
    render(
      <UnstyledTable
        data={selectionPeople}
        columns={columns}
        getRowKey={(row) => row.id}
      />,
    );

    expect(screen.queryAllByRole('checkbox')).toHaveLength(0);
  });

  it('renders a select-all checkbox in the header and one checkbox per row when selectable', () => {
    render(
      <UnstyledTable
        data={selectionPeople}
        columns={columns}
        getRowKey={(row) => row.id}
        selectable
      />,
    );

    expect(getSelectAllCheckbox()).toBeInTheDocument();
    expect(screen.getAllByRole('checkbox')).toHaveLength(
      selectionPeople.length + 1,
    );
  });

  it('the select-all checkbox starts unchecked and not indeterminate', () => {
    render(
      <UnstyledTable
        data={selectionPeople}
        columns={columns}
        getRowKey={(row) => row.id}
        selectable
      />,
    );

    const selectAll = getSelectAllCheckbox() as HTMLInputElement;
    expect(selectAll).not.toBeChecked();
    expect(selectAll.indeterminate).toBe(false);
  });

  it('selects a row, uncontrolled, when its checkbox is clicked', async () => {
    render(
      <UnstyledTable
        data={selectionPeople}
        columns={columns}
        getRowKey={(row) => row.id}
        selectable
      />,
    );
    const rows = getBodyRows();

    await user.click(getRowCheckbox(rows[0]));

    expect(getRowCheckbox(rows[0])).toBeChecked();
    expect(getRowCheckbox(rows[1])).not.toBeChecked();
    expect(getRowCheckbox(rows[2])).not.toBeChecked();
  });

  it('deselects a row when its already-checked checkbox is clicked again', async () => {
    render(
      <UnstyledTable
        data={selectionPeople}
        columns={columns}
        getRowKey={(row) => row.id}
        selectable
      />,
    );
    const rows = getBodyRows();
    const checkbox = getRowCheckbox(rows[0]);

    await user.click(checkbox);
    await user.click(checkbox);

    expect(checkbox).not.toBeChecked();
  });

  it('the select-all checkbox is indeterminate when some but not all rows are selected', async () => {
    render(
      <UnstyledTable
        data={selectionPeople}
        columns={columns}
        getRowKey={(row) => row.id}
        selectable
      />,
    );
    const rows = getBodyRows();

    await user.click(getRowCheckbox(rows[0]));

    const selectAll = getSelectAllCheckbox() as HTMLInputElement;
    expect(selectAll).not.toBeChecked();
    expect(selectAll.indeterminate).toBe(true);
  });

  it('the select-all checkbox becomes checked once every row is selected', async () => {
    render(
      <UnstyledTable
        data={selectionPeople}
        columns={columns}
        getRowKey={(row) => row.id}
        selectable
      />,
    );

    for (const row of getBodyRows()) {
      await user.click(getRowCheckbox(row));
    }

    const selectAll = getSelectAllCheckbox() as HTMLInputElement;
    expect(selectAll).toBeChecked();
    expect(selectAll.indeterminate).toBe(false);
  });

  it('clicking select-all selects every currently rendered row', async () => {
    render(
      <UnstyledTable
        data={selectionPeople}
        columns={columns}
        getRowKey={(row) => row.id}
        selectable
      />,
    );

    await user.click(getSelectAllCheckbox());

    for (const row of getBodyRows()) {
      expect(getRowCheckbox(row)).toBeChecked();
    }
  });

  it('clicking a fully-checked select-all deselects every row', async () => {
    render(
      <UnstyledTable
        data={selectionPeople}
        columns={columns}
        getRowKey={(row) => row.id}
        selectable
      />,
    );

    await user.click(getSelectAllCheckbox());
    await user.click(getSelectAllCheckbox());

    for (const row of getBodyRows()) {
      expect(getRowCheckbox(row)).not.toBeChecked();
    }
  });

  it('supports controlled selection via selected + onSelectionChange, without updating internally', async () => {
    const handleSelectionChange = vi.fn();
    render(
      <UnstyledTable
        data={selectionPeople}
        columns={columns}
        getRowKey={(row) => row.id}
        selectable
        selected={[]}
        onSelectionChange={handleSelectionChange}
      />,
    );
    const rows = getBodyRows();

    await user.click(getRowCheckbox(rows[0]));

    expect(handleSelectionChange).toHaveBeenCalledWith(['1']);
    // still unchecked — nothing fed the new selection back in via props
    expect(getRowCheckbox(rows[0])).not.toBeChecked();
  });

  it('reflects externally-controlled selected ids', () => {
    render(
      <UnstyledTable
        data={selectionPeople}
        columns={columns}
        getRowKey={(row) => row.id}
        selectable
        selected={['2']}
        onSelectionChange={vi.fn()}
      />,
    );
    const rows = getBodyRows();

    expect(getRowCheckbox(rows[0])).not.toBeChecked();
    expect(getRowCheckbox(rows[1])).toBeChecked();
    expect(getRowCheckbox(rows[2])).not.toBeChecked();
  });

  it('keeps a selection attached to the correct row identity after a sort reorders the rows', async () => {
    // deliberately not sorted, so triggering a sort actually reorders rows
    const unsortedPeople: Person[] = [
      { id: '2', name: 'Alan Turing', age: 41 },
      { id: '3', name: 'Grace Hopper', age: 85 },
      { id: '1', name: 'Ada Lovelace', age: 36 },
    ];
    const sortableSelectionColumns: TableColumn<Person>[] = [
      { key: 'name', header: 'Name', sortable: true },
      { key: 'age', header: 'Age' },
    ];
    render(
      <UnstyledTable
        data={unsortedPeople}
        columns={sortableSelectionColumns}
        getRowKey={(row) => row.id}
        selectable
      />,
    );

    // select "Alan Turing", currently at row index 0
    await user.click(getRowCheckbox(getBodyRows()[0]));

    // ascending by name reorders to: Ada, Alan, Grace — Alan moves to index 1
    await user.click(getSortButton('Name'));

    const rowsAfterSort = getBodyRows();
    expect(
      within(rowsAfterSort[1]).getByRole('cell', { name: 'Alan Turing' }),
    ).toBeInTheDocument();
    expect(getRowCheckbox(rowsAfterSort[0])).not.toBeChecked();
    expect(getRowCheckbox(rowsAfterSort[1])).toBeChecked();
    expect(getRowCheckbox(rowsAfterSort[2])).not.toBeChecked();
  });
});

describe('UnstyledTable pagination', () => {
  const paginationPeople: Person[] = [
    { id: '1', name: 'Person A', age: 20 },
    { id: '2', name: 'Person B', age: 21 },
    { id: '3', name: 'Person C', age: 22 },
    { id: '4', name: 'Person D', age: 23 },
    { id: '5', name: 'Person E', age: 24 },
  ];

  it('renders every row when not paginated, regardless of data length', () => {
    render(<UnstyledTable data={paginationPeople} columns={columns} />);

    expect(getBodyRows()).toHaveLength(paginationPeople.length);
  });

  it('shows only the first pageSize rows on page 1 when paginated', () => {
    render(
      <UnstyledTable
        data={paginationPeople}
        columns={columns}
        paginated
        pageSize={2}
      />,
    );

    const rows = getBodyRows();
    expect(rows).toHaveLength(2);
    expect(
      within(rows[0]).getByRole('cell', { name: 'Person A' }),
    ).toBeInTheDocument();
    expect(
      within(rows[1]).getByRole('cell', { name: 'Person B' }),
    ).toBeInTheDocument();
  });

  it('shows a page indicator with the current page and total page count', () => {
    render(
      <UnstyledTable
        data={paginationPeople}
        columns={columns}
        paginated
        pageSize={2}
      />,
    );

    expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();
  });

  it('disables the previous-page button on the first page', () => {
    render(
      <UnstyledTable
        data={paginationPeople}
        columns={columns}
        paginated
        pageSize={2}
      />,
    );

    expect(getPreviousPageButton()).toBeDisabled();
  });

  it('advances to the next page, uncontrolled, when next is clicked', async () => {
    render(
      <UnstyledTable
        data={paginationPeople}
        columns={columns}
        paginated
        pageSize={2}
      />,
    );

    await user.click(getNextPageButton());

    const rows = getBodyRows();
    expect(rows).toHaveLength(2);
    expect(
      within(rows[0]).getByRole('cell', { name: 'Person C' }),
    ).toBeInTheDocument();
    expect(
      within(rows[1]).getByRole('cell', { name: 'Person D' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Page 2 of 3')).toBeInTheDocument();
  });

  it('goes back to the previous page when previous is clicked', async () => {
    render(
      <UnstyledTable
        data={paginationPeople}
        columns={columns}
        paginated
        pageSize={2}
      />,
    );

    await user.click(getNextPageButton());
    await user.click(getPreviousPageButton());

    expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();
    expect(
      within(getBodyRows()[0]).getByRole('cell', { name: 'Person A' }),
    ).toBeInTheDocument();
  });

  it('disables the next-page button on the last page', async () => {
    render(
      <UnstyledTable
        data={paginationPeople}
        columns={columns}
        paginated
        pageSize={2}
      />,
    );
    const next = getNextPageButton();

    await user.click(next);
    await user.click(next);

    expect(screen.getByText('Page 3 of 3')).toBeInTheDocument();
    expect(getBodyRows()).toHaveLength(1);
    expect(next).toBeDisabled();
  });

  it('supports controlled pagination via page + onPageChange, without updating internally', async () => {
    const handlePageChange = vi.fn();
    render(
      <UnstyledTable
        data={paginationPeople}
        columns={columns}
        paginated
        pageSize={2}
        page={1}
        onPageChange={handlePageChange}
      />,
    );

    await user.click(getNextPageButton());

    expect(handlePageChange).toHaveBeenCalledWith(2);
    // still page 1 — nothing fed the new page back in via props
    expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();
  });

  it('reflects an externally-controlled page', () => {
    render(
      <UnstyledTable
        data={paginationPeople}
        columns={columns}
        paginated
        pageSize={2}
        page={2}
        onPageChange={vi.fn()}
      />,
    );

    expect(screen.getByText('Page 2 of 3')).toBeInTheDocument();
    expect(
      within(getBodyRows()[0]).getByRole('cell', { name: 'Person C' }),
    ).toBeInTheDocument();
  });

  it('clamps back to the last valid page when filtering shrinks the row count below the current page, uncontrolled', async () => {
    render(
      <UnstyledTable
        data={paginationPeople}
        columns={columns}
        paginated
        pageSize={2}
        filterable
      />,
    );

    await user.click(getNextPageButton());
    expect(screen.getByText('Page 2 of 3')).toBeInTheDocument();

    // only "Person A" matches — down to 1 row, 1 page total
    await user.type(getSearchInput(), 'Person A');

    expect(screen.getByText('Page 1 of 1')).toBeInTheDocument();
    expect(
      within(getBodyRows()[0]).getByRole('cell', { name: 'Person A' }),
    ).toBeInTheDocument();
  });
});
