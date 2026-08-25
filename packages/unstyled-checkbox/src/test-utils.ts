import { screen } from '@testing-library/react';

export function getCheckbox(name?: string | RegExp): HTMLElement {
  return screen.getByRole(
    'checkbox',
    name === undefined ? undefined : { name },
  );
}
