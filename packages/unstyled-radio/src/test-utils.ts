import { screen } from '@testing-library/react';

export function getRadio(name?: string | RegExp): HTMLElement {
  return screen.getByRole('radio', name === undefined ? undefined : { name });
}
