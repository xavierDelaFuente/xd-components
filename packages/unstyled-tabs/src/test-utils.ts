import { screen } from '@testing-library/react';

export function getTabList(): HTMLElement {
  return screen.getByRole('tablist');
}

export function getTab(name: string | RegExp): HTMLElement {
  return screen.getByRole('tab', { name });
}

export function getAllTabs(): HTMLElement[] {
  return screen.getAllByRole('tab');
}

export function getPanel(name?: string | RegExp): HTMLElement {
  return screen.getByRole(
    'tabpanel',
    name === undefined ? undefined : { name },
  );
}
