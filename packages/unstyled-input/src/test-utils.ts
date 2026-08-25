import { screen } from '@testing-library/react';

export function getInput(name?: string | RegExp): HTMLElement {
  return screen.getByRole('textbox', name === undefined ? undefined : { name });
}
