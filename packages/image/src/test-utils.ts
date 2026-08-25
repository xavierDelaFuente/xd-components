import { screen } from '@testing-library/react';

export function getImage(alt: string | RegExp): HTMLElement {
  return screen.getByAltText(alt);
}
