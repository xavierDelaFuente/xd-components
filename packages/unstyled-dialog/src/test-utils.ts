import { screen } from '@testing-library/react';

// A native <dialog> exposes role="dialog" only while open (a closed <dialog>
// is inert / not in the accessibility tree), so query with the *query* form
// when asserting it is absent.
export function getDialog(name?: string | RegExp): HTMLElement {
  return screen.getByRole('dialog', name === undefined ? undefined : { name });
}

export function queryDialog(): HTMLElement | null {
  return screen.queryByRole('dialog');
}

export function getButton(name: string | RegExp): HTMLElement {
  return screen.getByRole('button', { name });
}
