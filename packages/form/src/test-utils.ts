import { screen } from '@testing-library/react';
import type { UserEvent } from '@testing-library/user-event';

type FieldRole = 'textbox' | 'spinbutton';

export function getFieldInput(
  name: string | RegExp,
  role: FieldRole = 'textbox',
): HTMLElement {
  return screen.getByRole(role, { name });
}

export function getSubmitButton(name: string | RegExp = 'Save'): HTMLElement {
  return screen.getByRole('button', { name });
}

export function submitForm(
  user: UserEvent,
  name: string | RegExp = 'Save',
): Promise<void> {
  return user.click(getSubmitButton(name));
}

export function getErrorSummary(): HTMLElement {
  return screen.getByRole('alert');
}

export function queryErrorSummary(): HTMLElement | null {
  return screen.queryByRole('alert');
}
