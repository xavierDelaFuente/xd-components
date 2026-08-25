import { screen } from '@testing-library/react';
import type { UserEvent } from '@testing-library/user-event';

export function getButton(name?: string | RegExp): HTMLElement {
  return screen.getByRole('button', name === undefined ? undefined : { name });
}

export function getInner(): HTMLElement {
  return screen.getByTestId('inner');
}

export function clickButton(user: UserEvent): Promise<void> {
  return user.click(getButton());
}

export function hoverButton(user: UserEvent): Promise<void> {
  return user.hover(getButton());
}

export function unhoverButton(user: UserEvent): Promise<void> {
  return user.unhover(getButton());
}
