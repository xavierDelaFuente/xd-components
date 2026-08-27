import { getRowIdentity, type RowId } from './rowIdentity';
import type { TableColumn } from './TableHeaderRow';

function booleanToString(value: boolean | undefined): string | undefined {
  return value ? 'true' : undefined;
}

export function TableBodyRows<T>({
  columns,
  data,
  getRowKey,
  selectable,
  isRowSelected,
  onToggleRow,
}: {
  columns: TableColumn<T>[];
  data: T[];
  getRowKey?: (row: T) => RowId;
  selectable?: boolean;
  isRowSelected?: (row: T) => boolean;
  onToggleRow?: (row: T) => void;
}) {
  return (
    <tbody>
      {data.map((row) => (
        <tr key={getRowIdentity(row, getRowKey)}>
          {selectable && (
            <td>
              <input
                type="checkbox"
                checked={isRowSelected?.(row) ?? false}
                onChange={() => onToggleRow?.(row)}
                data-checked={booleanToString(isRowSelected?.(row))}
              />
            </td>
          )}
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
