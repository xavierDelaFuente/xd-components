import { screen } from '@testing-library/react';

export function getSwitch(name?: string | RegExp): HTMLElement {
  return screen.getByRole('switch', name === undefined ? undefined : { name });
}
