import { render, screen, within } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { type TableColumn, UnstyledTable } from '../components';
import {
  getBodyRows,
  getRowCheckbox,
  getSelectAllCheckbox,
  getSortButton,
} from '../test-utils';
import { columns, type Person } from './fixtures';

let user: UserEvent;

beforeEach(() => {
  user = userEvent.setup();
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

  it("mirrors a row checkbox's checked state via data-checked, not just the native checked property", async () => {
    render(
      <UnstyledTable
        data={selectionPeople}
        columns={columns}
        getRowKey={(row) => row.id}
        selectable
      />,
    );
    const rows = getBodyRows();

    expect(getRowCheckbox(rows[0])).not.toHaveAttribute('data-checked');

    await user.click(getRowCheckbox(rows[0]));

    expect(getRowCheckbox(rows[0])).toHaveAttribute('data-checked', 'true');
    expect(getRowCheckbox(rows[1])).not.toHaveAttribute('data-checked');
  });

  it("mirrors the select-all checkbox's checked/indeterminate state via data-* attributes", async () => {
    render(
      <UnstyledTable
        data={selectionPeople}
        columns={columns}
        getRowKey={(row) => row.id}
        selectable
      />,
    );

    expect(getSelectAllCheckbox()).not.toHaveAttribute('data-checked');
    expect(getSelectAllCheckbox()).not.toHaveAttribute('data-indeterminate');

    await user.click(getRowCheckbox(getBodyRows()[0]));

    expect(getSelectAllCheckbox()).not.toHaveAttribute('data-checked');
    expect(getSelectAllCheckbox()).toHaveAttribute(
      'data-indeterminate',
      'true',
    );

    await user.click(getSelectAllCheckbox());

    expect(getSelectAllCheckbox()).toHaveAttribute('data-checked', 'true');
    expect(getSelectAllCheckbox()).not.toHaveAttribute('data-indeterminate');
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
