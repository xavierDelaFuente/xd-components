import { useState } from 'react';
import { getRowIdentity, type RowId } from './rowIdentity';

export function useTableSelection<T>({
  data,
  getRowKey,
  selected,
  defaultSelected,
  onSelectionChange,
}: {
  data: T[];
  getRowKey?: (row: T) => RowId;
  selected?: RowId[];
  defaultSelected?: RowId[];
  onSelectionChange?: (selected: RowId[]) => void;
}) {
  const isControlled = selected !== undefined;
  const [internalSelected, setInternalSelected] = useState<RowId[]>(
    defaultSelected ?? [],
  );
  const selectedIds = isControlled ? selected : internalSelected;

  const updateSelection = (next: RowId[]) => {
    if (!isControlled) {
      setInternalSelected(next);
    }
    onSelectionChange?.(next);
  };

  const isRowSelected = (row: T) =>
    selectedIds.includes(getRowIdentity(row, getRowKey));

  const toggleRow = (row: T) => {
    const id = getRowIdentity(row, getRowKey);
    const next = selectedIds.includes(id)
      ? selectedIds.filter((selectedId) => selectedId !== id)
      : [...selectedIds, id];
    updateSelection(next);
  };

  const rowIds = data.map((row) => getRowIdentity(row, getRowKey));
  const allSelected =
    rowIds.length > 0 && rowIds.every((id) => selectedIds.includes(id));
  const someSelected = rowIds.some((id) => selectedIds.includes(id));

  const toggleAll = () => {
    updateSelection(allSelected ? [] : rowIds);
  };

  return {
    isRowSelected,
    toggleRow,
    toggleAll,
    allSelected,
    someSelected,
  };
}
