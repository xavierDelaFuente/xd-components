import { screen, within } from '@testing-library/react';
import type { UserEvent } from '@testing-library/user-event';

export function getCombobox(): HTMLElement {
  return screen.getByRole('combobox');
}

export function getListbox(): HTMLElement {
  return screen.getByRole('listbox');
}

export function queryListbox(): HTMLElement | null {
  return screen.queryByRole('listbox');
}

export function getOptions(): HTMLElement[] {
  return within(getListbox()).getAllByRole('option');
}

export function getOptionLabels(): (string | null)[] {
  return getOptions().map((option) => option.textContent);
}

export function getOption(name: string): HTMLElement {
  return screen.getByRole('option', { name });
}

export function openSelect(user: UserEvent): Promise<void> {
  return user.click(getCombobox());
}

export function clickOption(user: UserEvent, name: string): Promise<void> {
  return user.click(getOption(name));
}
