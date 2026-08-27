import { type ComponentPropsWithoutRef, type ForwardedRef, forwardRef } from 'react';
import type { RowId } from './rowIdentity';
import { TableBodyRows } from './TableBodyRows';
import { type TableColumn, TableHeaderRow } from './TableHeaderRow';
import { useTableFilter } from './useTableFilter';
import { useTableSelection } from './useTableSelection';
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
  getRowKey?: (row: T) => RowId;
  selectable?: boolean;
  selected?: RowId[];
  defaultSelected?: RowId[];
  onSelectionChange?: (selected: RowId[]) => void;
} & Omit<ComponentPropsWithoutRef<'table'>, 'children'>;

function UnstyledTableInner<T>(
  {
    columns,
    data,
    sort,
    defaultSort,
    onSortChange,
    filterable,
    getRowKey,
    selectable,
    selected,
    defaultSelected,
    onSelectionChange,
    ...rest
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
  const { isRowSelected, toggleRow, toggleAll, allSelected, someSelected } =
    useTableSelection({
      data: sortedData,
      getRowKey,
      selected,
      defaultSelected,
      onSelectionChange,
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
      <table ref={ref} {...rest}>
        <TableHeaderRow
          columns={columns}
          sortState={sortState}
          onSort={handleSort}
          selectable={selectable}
          allSelected={allSelected}
          someSelected={someSelected}
          onToggleAll={toggleAll}
        />
        <TableBodyRows
          columns={columns}
          data={sortedData}
          getRowKey={getRowKey}
          selectable={selectable}
          isRowSelected={isRowSelected}
          onToggleRow={toggleRow}
        />
      </table>
    </>
  );
}

export const UnstyledTable = forwardRef(UnstyledTableInner) as <T>(
  props: UnstyledTableProps<T> & { ref?: ForwardedRef<HTMLTableElement> },
) => React.ReactElement;
