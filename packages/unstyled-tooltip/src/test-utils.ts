import { screen } from '@testing-library/react';

export function getTooltip(): HTMLElement {
  return screen.getByRole('tooltip');
}

export function queryTooltip(): HTMLElement | null {
  return screen.queryByRole('tooltip');
}

export function getTrigger(name: string | RegExp): HTMLElement {
  return screen.getByRole('button', { name });
}
