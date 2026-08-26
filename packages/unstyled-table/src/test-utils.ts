import { screen, within } from '@testing-library/react';

export function getTable(): HTMLElement {
  return screen.getByRole('table');
}

export function getBodyRows(): HTMLElement[] {
  // getAllByRole('row') includes the header row, so drop it
  return screen.getAllByRole('row').slice(1);
}

export function getNameHeader() {
  return screen.getByRole('columnheader', { name: 'Name' });
}

export function getNameSortButton() {
  return screen.getByRole('button', { name: 'Name' });
}

export function namesInOrder(): string[] {
  return getBodyRows().map(
    (row) => within(row).getAllByRole('cell')[0].textContent,
  ) as string[];
}

export function getSearchInput() {
  return screen.getByRole('textbox', { name: 'Search table' });
}
