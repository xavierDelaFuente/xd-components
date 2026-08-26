import {
  type ForwardedRef,
  forwardRef,
  type ReactNode,
  useMemo,
  useState,
} from 'react';

export type SortDirection = 'asc' | 'desc';

export type SortState<T> = {
  key: keyof T;
  direction: SortDirection;
};

export type TableColumn<T> = {
  key: keyof T;
  header: string;
  render?: (row: T) => ReactNode;
  sortable?: boolean;
};

export type UnstyledTableProps<T> = {
  columns: TableColumn<T>[];
  data: T[];
  sort?: SortState<T> | null;
  defaultSort?: SortState<T> | null;
  onSortChange?: (sort: SortState<T> | null) => void;
};

function TableHeader<T>({
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

function Header<T>({
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
        {columns.map((column) => {
          return (
            <TableHeader
              key={String(column.key)}
              column={column}
              sortState={sortState}
              onSort={onSort}
            />
          );
        })}
      </tr>
    </thead>
  );
}

function Body<T>({ columns, data }: { columns: TableColumn<T>[]; data: T[] }) {
  return (
    <tbody>
      {data.map((row, index) => (
        <tr key={index}>
          {columns.map((column) => (
            <td key={String(column.key)}>
              {column.render ? column.render(row) : String(row[column.key])}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}

function UnstyledTableInner<T>(
  { columns, data, sort, defaultSort, onSortChange }: UnstyledTableProps<T>,
  ref: ForwardedRef<HTMLTableElement>,
) {
  const isControlled = sort !== undefined;
  const [internalSort, setInternalSort] = useState<SortState<T> | null>(
    defaultSort ?? null,
  );
  const sortState = isControlled ? sort : internalSort;

  const handleSort = (key: keyof T) => {
    let next: SortState<T> | null;
    if (sortState?.key === key) {
      next = sortState.direction === 'asc' ? { key, direction: 'desc' } : null;
    } else {
      next = { key, direction: 'asc' };
    }

    if (!isControlled) {
      setInternalSort(next);
    }
    onSortChange?.(next);
  };

  const sortedData = useMemo(() => {
    if (!sortState) {
      return data;
    }
    const { key, direction } = sortState;
    return [...data].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortState]);

  return (
    <table ref={ref}>
      <Header columns={columns} sortState={sortState} onSort={handleSort} />
      <Body columns={columns} data={sortedData} />
    </table>
  );
}

export const UnstyledTable = forwardRef(UnstyledTableInner) as <T>(
  props: UnstyledTableProps<T> & { ref?: ForwardedRef<HTMLTableElement> },
) => React.ReactElement;
