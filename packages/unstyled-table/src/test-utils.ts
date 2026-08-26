import { screen } from '@testing-library/react';

export function getTable(): HTMLElement {
  return screen.getByRole('table');
}

export function getBodyRows(): HTMLElement[] {
  // getAllByRole('row') includes the header row, so drop it
  return screen.getAllByRole('row').slice(1);
}