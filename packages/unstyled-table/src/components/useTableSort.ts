import { useMemo, useState } from 'react';
import type { SortState } from './UnstyledTable';

export function useTableSort<T>({
  data,
  sort,
  defaultSort,
  onSortChange,
}: {
  data: T[];
  sort?: SortState<T> | null;
  defaultSort?: SortState<T> | null;
  onSortChange?: (sort: SortState<T> | null) => void;
}) {
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

  return { sortState, handleSort, sortedData };
}
