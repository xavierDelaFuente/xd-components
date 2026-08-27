export type RowId = string | number;

export function getRowIdentity<T>(
  row: T,
  getRowKey?: (row: T) => RowId,
): RowId {
  return getRowKey ? getRowKey(row) : JSON.stringify(row);
}
