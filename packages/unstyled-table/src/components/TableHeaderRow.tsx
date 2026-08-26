import type { ReactNode } from 'react';
import type { SortState } from './UnstyledTable';

export type TableColumn<T> = {
  key: keyof T;
  header: string;
  render?: (row: T) => ReactNode;
  sortable?: boolean;
};

function TableHeaderCell<T>({
  column,
  sortState,
  onSort,
}: {
  column: TableColumn<T>;
  sortState: SortState<T> | null;
  onSort: (key: keyof T) => void;
}) {
  if (!column.sortable) {
    return <th>{column.header}</th>;
  }

  const isActive = sortState?.key === column.key;
  const ariaSort = isActive
    ? sortState.direction === 'asc'
      ? 'ascending'
      : 'descending'
    : 'none';

  return (
    <th aria-sort={ariaSort}>
      <button type="button" onClick={() => onSort(column.key)}>
        {column.header}
      </button>
    </th>
  );
}

export function TableHeaderRow<T>({
  columns,
  sortState,
  onSort,
}: {
  columns: TableColumn<T>[];
  sortState: SortState<T> | null;
  onSort: (key: keyof T) => void;
}) {
  return (
    <thead>
      <tr>
        {columns.map((column) => (
          <TableHeaderCell
            key={String(column.key)}
            column={column}
            sortState={sortState}
            onSort={onSort}
          />
        ))}
      </tr>
    </thead>
  );
}
