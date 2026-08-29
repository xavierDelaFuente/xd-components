import { screen } from '@testing-library/react';

export function getTextarea(name?: string | RegExp): HTMLElement {
  return screen.getByRole('textbox', name === undefined ? undefined : { name });
}
