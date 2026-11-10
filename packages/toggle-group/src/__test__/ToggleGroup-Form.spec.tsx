import { render, screen } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import type { FormEvent } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ToggleGroup, ToggleGroupItem } from '../components';

// Captures what the browser would send: the form's fields plus the clicked
// submit button's name=value (the `submitter`).
function captureSubmit() {
  const submitted: FormData[] = [];
  const onSubmit = vi.fn((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { submitter } = event.nativeEvent as SubmitEvent;
    submitted.push(new FormData(event.currentTarget, submitter));
  });
  return { onSubmit, submitted };
}

const getItem = (name: string) => screen.getByRole('button', { name });

let user: UserEvent;

beforeEach(() => {
  user = userEvent.setup();
});

describe('ToggleGroup — inside a plain <form>', () => {
  it('submits name=value of the clicked type="submit" item', async () => {
    const { onSubmit, submitted } = captureSubmit();
    render(
      <form onSubmit={onSubmit}>
        <ToggleGroup aria-label="Colour mode" name="mode" value="system">
          <ToggleGroupItem type="submit" value="system">
            System
          </ToggleGroupItem>
          <ToggleGroupItem type="submit" value="dark">
            Dark
          </ToggleGroupItem>
        </ToggleGroup>
      </form>,
    );

    await user.click(getItem('Dark'));

    expect(onSubmit).toHaveBeenCalledOnce();
    expect(submitted[0].getAll('mode')).toEqual(['dark']);
  });

  it('sends only the clicked item, not every item in the group', async () => {
    const { submitted, onSubmit } = captureSubmit();
    render(
      <form onSubmit={onSubmit}>
        <ToggleGroup aria-label="Colour mode" name="mode" value="light">
          <ToggleGroupItem type="submit" value="system">
            System
          </ToggleGroupItem>
          <ToggleGroupItem type="submit" value="light">
            Light
          </ToggleGroupItem>
          <ToggleGroupItem type="submit" value="dark">
            Dark
          </ToggleGroupItem>
        </ToggleGroup>
      </form>,
    );

    await user.click(getItem('System'));

    expect(submitted[0].getAll('mode')).toEqual(['system']);
  });

  it('submits alongside the other form fields', async () => {
    const { submitted, onSubmit } = captureSubmit();
    render(
      <form onSubmit={onSubmit}>
        <input type="hidden" name="section" value="appearance" />
        <ToggleGroup aria-label="Colour mode" name="mode">
          <ToggleGroupItem type="submit" value="dark">
            Dark
          </ToggleGroupItem>
        </ToggleGroup>
      </form>,
    );

    await user.click(getItem('Dark'));

    expect(Object.fromEntries(submitted[0])).toEqual({
      section: 'appearance',
      mode: 'dark',
    });
  });

  it('does not submit when items keep the default type="button"', async () => {
    const { onSubmit } = captureSubmit();
    render(
      <form onSubmit={onSubmit}>
        <ToggleGroup aria-label="Colour mode" name="mode" defaultValue="light">
          <ToggleGroupItem value="light">Light</ToggleGroupItem>
          <ToggleGroupItem value="dark">Dark</ToggleGroupItem>
        </ToggleGroup>
      </form>,
    );

    await user.click(getItem('Dark'));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(getItem('Dark')).toHaveAttribute('aria-pressed', 'true');
  });

  it('does not submit from a disabled item', async () => {
    const { onSubmit } = captureSubmit();
    render(
      <form onSubmit={onSubmit}>
        <ToggleGroup aria-label="Colour mode" name="mode" disabled>
          <ToggleGroupItem type="submit" value="dark">
            Dark
          </ToggleGroupItem>
        </ToggleGroup>
      </form>,
    );

    await user.click(getItem('Dark'));

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('both moves the pressed state and submits in an uncontrolled group', async () => {
    const { onSubmit, submitted } = captureSubmit();
    render(
      <form onSubmit={onSubmit}>
        <ToggleGroup aria-label="Colour mode" name="mode" defaultValue="light">
          <ToggleGroupItem type="submit" value="light">
            Light
          </ToggleGroupItem>
          <ToggleGroupItem type="submit" value="dark">
            Dark
          </ToggleGroupItem>
        </ToggleGroup>
      </form>,
    );

    await user.click(getItem('Dark'));

    expect(getItem('Dark')).toHaveAttribute('aria-pressed', 'true');
    expect(submitted[0].get('mode')).toBe('dark');
  });
});
