import { useMemo, useState } from 'react';
import type { TableColumn } from './TableHeaderRow';

export function useTableFilter<T>({
  data,
  columns,
}: {
  data: T[];
  columns: TableColumn<T>[];
}) {
  const [filterQuery, setFilterQuery] = useState('');

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

  return { filterQuery, setFilterQuery, filteredData };
}
