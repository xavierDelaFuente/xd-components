import { screen, within } from '@testing-library/react';

export function getTable(): HTMLElement {
  return screen.getByRole('table');
}

export function getBodyRows(): HTMLElement[] {
  // getAllByRole('row') includes the header row, so drop it
  return screen.getAllByRole('row').slice(1);
}

export function getColumnHeader(name: string): HTMLElement {
  return screen.getByRole('columnheader', { name });
}

export function getSortButton(name: string): HTMLElement {
  return screen.getByRole('button', { name });
}

export function namesInOrder(): string[] {
  return getBodyRows().map(
    (row) => within(row).getAllByRole('cell')[0].textContent,
  ) as string[];
}

export function getSearchInput() {
  return screen.getByRole('textbox', { name: 'Search table' });
}

export function getSelectAllCheckbox(): HTMLElement {
  return screen.getByRole('checkbox', { name: 'Select all rows' });
}

export function getRowCheckbox(row: HTMLElement): HTMLElement {
  return within(row).getByRole('checkbox');
}

export function getNextPageButton(): HTMLElement {
  return screen.getByRole('button', { name: 'Next page' });
}

export function getPreviousPageButton(): HTMLElement {
  return screen.getByRole('button', { name: 'Previous page' });
}

export function getFirstPageButton(): HTMLElement {
  return screen.getByRole('button', { name: 'First page' });
}

export function getLastPageButton(): HTMLElement {
  return screen.getByRole('button', { name: 'Last page' });
}
