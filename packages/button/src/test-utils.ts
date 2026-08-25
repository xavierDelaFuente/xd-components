import { screen } from '@testing-library/react';
import type { UserEvent } from '@testing-library/user-event';

export function getButton(name?: string | RegExp): HTMLElement {
  return screen.getByRole('button', name === undefined ? undefined : { name });
}

export function clickButton(user: UserEvent): Promise<void> {
  return user.click(getButton());
}
