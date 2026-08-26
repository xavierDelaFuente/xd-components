import { type ForwardedRef, forwardRef } from 'react';
import { TableBodyRows } from './TableBodyRows';
import { type TableColumn, TableHeaderRow } from './TableHeaderRow';
import { useTableFilter } from './useTableFilter';
import { useTableSort } from './useTableSort';

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
  const { filterQuery, setFilterQuery, filteredData } = useTableFilter({
    data,
    columns,
  });
  const { sortState, handleSort, sortedData } = useTableSort({
    data: filteredData,
    sort,
    defaultSort,
    onSortChange,
  });

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
