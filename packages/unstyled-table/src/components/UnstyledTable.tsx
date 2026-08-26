import { type ForwardedRef, forwardRef, useMemo, useState } from 'react';
import { TableBodyRows } from './TableBodyRows';
import { type TableColumn, TableHeaderRow } from './TableHeaderRow';

export type SortDirection = 'asc' | 'desc';

export type SortState<T> = {
  key: keyof T;
  direction: SortDirection;
};

export type UnstyledTableProps<T> = {
  columns: TableColumn<T>[];
  data: T[];
  sort?: SortState<T> | null;
  defaultSort?: SortState<T> | null;
  onSortChange?: (sort: SortState<T> | null) => void;
  filterable?: boolean;
};

function UnstyledTableInner<T>(
  {
    columns,
    data,
    sort,
    defaultSort,
    onSortChange,
    filterable,
  }: UnstyledTableProps<T>,
  ref: ForwardedRef<HTMLTableElement>,
) {
  const isControlled = sort !== undefined;
  const [internalSort, setInternalSort] = useState<SortState<T> | null>(
    defaultSort ?? null,
  );
  const sortState = isControlled ? sort : internalSort;
  const [filterQuery, setFilterQuery] = useState('');

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

  const filteredData = useMemo(() => {
    if (!filterQuery) {
      return data;
    }
    const query = filterQuery.toLowerCase();
    return data.filter((row) =>
      columns.some((column) =>
        String(row[column.key]).toLowerCase().includes(query),
      ),
    );
  }, [data, columns, filterQuery]);

  const sortedData = useMemo(() => {
    if (!sortState) {
      return filteredData;
    }
    const { key, direction } = sortState;
    return [...filteredData].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortState]);

  return (
    <>
      {filterable && (
        <input
          aria-label="Search table"
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
        />
      )}
      <table ref={ref}>
        <TableHeaderRow
          columns={columns}
          sortState={sortState}
          onSort={handleSort}
        />
        <TableBodyRows columns={columns} data={sortedData} />
      </table>
    </>
  );
}

export const UnstyledTable = forwardRef(UnstyledTableInner) as <T>(
  props: UnstyledTableProps<T> & { ref?: ForwardedRef<HTMLTableElement> },
) => React.ReactElement;
