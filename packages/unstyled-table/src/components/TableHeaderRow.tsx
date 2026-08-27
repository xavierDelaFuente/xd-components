import { type ReactNode, useEffect, useRef } from 'react';
import type { SortState } from './UnstyledTable';

export type TableColumn<T> = {
  key: keyof T;
  header: string;
  render?: (row: T) => ReactNode;
  sortable?: boolean;
};

function booleanToString(value: boolean | undefined): string | undefined {
  return value ? 'true' : undefined;
}

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

function SelectAllHeaderCell({
  checked,
  indeterminate,
  onToggle,
}: {
  checked: boolean;
  indeterminate: boolean;
  onToggle: () => void;
}) {
  const checkboxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <th>
      <input
        ref={checkboxRef}
        type="checkbox"
        aria-label="Select all rows"
        checked={checked}
        onChange={onToggle}
        data-checked={booleanToString(checked)}
        data-indeterminate={booleanToString(indeterminate)}
      />
    </th>
  );
}

export function TableHeaderRow<T>({
  columns,
  sortState,
  onSort,
  selectable,
  allSelected,
  someSelected,
  onToggleAll,
}: {
  columns: TableColumn<T>[];
  sortState: SortState<T> | null;
  onSort: (key: keyof T) => void;
  selectable?: boolean;
  allSelected?: boolean;
  someSelected?: boolean;
  onToggleAll?: () => void;
}) {
  return (
    <thead>
      <tr>
        {selectable && (
          <SelectAllHeaderCell
            checked={!!allSelected}
            indeterminate={!!someSelected && !allSelected}
            onToggle={() => onToggleAll?.()}
          />
        )}
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
