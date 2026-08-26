import type { TableColumn } from './TableHeaderRow';

export function TableBodyRows<T>({
  columns,
  data,
  getRowKey,
}: {
  columns: TableColumn<T>[];
  data: T[];
  getRowKey?: (row: T) => string | number;
}) {
  return (
    <tbody>
      {data.map((row) => (
        <tr key={getRowKey ? getRowKey(row) : JSON.stringify(row)}>
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
