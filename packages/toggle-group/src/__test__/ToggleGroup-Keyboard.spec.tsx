import { render, screen } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import type { FormEvent } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ToggleGroup, ToggleGroupItem } from '../components';

// Native Tab/Enter/Space on real <button>s, one tab stop per item. No roving
// tabindex or arrow keys: the group must work before JavaScript loads, and
// it is a set of toggle buttons, not a radiogroup.

function ModeGroup({ onValueChange }: { onValueChange?: (v: string) => void }) {
  return (
    <ToggleGroup
      aria-label="Colour mode"
      defaultValue="system"
      onValueChange={onValueChange}
    >
      <ToggleGroupItem value="system">System</ToggleGroupItem>
      <ToggleGroupItem value="light">Light</ToggleGroupItem>
      <ToggleGroupItem value="dark">Dark</ToggleGroupItem>
    </ToggleGroup>
  );
}

const getItem = (name: string) => screen.getByRole('button', { name });

let user: UserEvent;

beforeEach(() => {
  user = userEvent.setup();
});

describe('ToggleGroup — keyboard', () => {
  it('reaches every item with Tab, in order (one tab stop each)', async () => {
    render(<ModeGroup />);

    await user.tab();
    expect(getItem('System')).toHaveFocus();
    await user.tab();
    expect(getItem('Light')).toHaveFocus();
    await user.tab();
    expect(getItem('Dark')).toHaveFocus();
  });

  it('goes back with Shift+Tab', async () => {
    render(<ModeGroup />);
    getItem('Dark').focus();

    await user.tab({ shift: true });

    expect(getItem('Light')).toHaveFocus();
  });

  it('skips a disabled item', async () => {
    render(
      <ToggleGroup aria-label="Colour mode">
        <ToggleGroupItem value="system">System</ToggleGroupItem>
        <ToggleGroupItem value="light" disabled>
          Light
        </ToggleGroupItem>
        <ToggleGroupItem value="dark">Dark</ToggleGroupItem>
      </ToggleGroup>,
    );

    await user.tab();
    await user.tab();

    expect(getItem('Dark')).toHaveFocus();
  });

  it('does not move focus with arrow keys (not a roving-tabindex widget)', async () => {
    render(<ModeGroup />);
    getItem('System').focus();

    await user.keyboard('{ArrowRight}');

    expect(getItem('System')).toHaveFocus();
  });

  it.each([
    ['Enter', '{Enter}'],
    ['Space', ' '],
  ])('selects the focused item with %s', async (_, keys) => {
    const onValueChange = vi.fn();
    render(<ModeGroup onValueChange={onValueChange} />);
    getItem('Dark').focus();

    await user.keyboard(keys);

    expect(getItem('Dark')).toHaveAttribute('aria-pressed', 'true');
    expect(onValueChange).toHaveBeenCalledWith('dark');
  });

  it('submits the focused type="submit" item with Enter', async () => {
    const submitted: FormData[] = [];
    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const { submitter } = event.nativeEvent as SubmitEvent;
      submitted.push(new FormData(event.currentTarget, submitter));
    };
    render(
      <form onSubmit={onSubmit}>
        <ToggleGroup aria-label="Colour mode" name="mode" value="system">
          <ToggleGroupItem type="submit" value="system">
            System
          </ToggleGroupItem>
          <ToggleGroupItem type="submit" value="light">
            Light
          </ToggleGroupItem>
        </ToggleGroup>
      </form>,
    );
    getItem('Light').focus();

    await user.keyboard('{Enter}');

    expect(submitted[0]?.get('mode')).toBe('light');
  });
});
