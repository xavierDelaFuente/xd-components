import { createRef } from 'react';
import { render } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Dialog, DialogTrigger } from '../components';
import { getButton } from '../test-utils';

let user: UserEvent;

beforeEach(() => {
  user = userEvent.setup();
});

describe('UnstyledDialog — root + trigger', () => {
  it('renders DialogTrigger as a button of type="button"', () => {
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
      </Dialog>,
    );
    expect(getButton('Open')).toHaveAttribute('type', 'button');
  });

  it('marks the trigger with aria-haspopup="dialog"', () => {
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
      </Dialog>,
    );
    expect(getButton('Open')).toHaveAttribute('aria-haspopup', 'dialog');
  });

  it('reflects the closed state as aria-expanded="false" on the trigger', () => {
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
      </Dialog>,
    );
    expect(getButton('Open')).toHaveAttribute('aria-expanded', 'false');
  });

  it('starts open when defaultOpen is set', () => {
    render(
      <Dialog defaultOpen>
        <DialogTrigger>Open</DialogTrigger>
      </Dialog>,
    );
    expect(getButton('Open')).toHaveAttribute('aria-expanded', 'true');
  });

  it('opens on trigger click when uncontrolled', async () => {
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
      </Dialog>,
    );
    await user.click(getButton('Open'));
    expect(getButton('Open')).toHaveAttribute('aria-expanded', 'true');
  });

  it('calls onOpenChange(true) when the trigger is clicked', async () => {
    const onOpenChange = vi.fn();
    render(
      <Dialog onOpenChange={onOpenChange}>
        <DialogTrigger>Open</DialogTrigger>
      </Dialog>,
    );
    await user.click(getButton('Open'));
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it('does not change its own state on click when controlled', async () => {
    const onOpenChange = vi.fn();
    render(
      <Dialog open={false} onOpenChange={onOpenChange}>
        <DialogTrigger>Open</DialogTrigger>
      </Dialog>,
    );
    await user.click(getButton('Open'));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(getButton('Open')).toHaveAttribute('aria-expanded', 'false');
  });

  it('composes a consumer onClick on the trigger', async () => {
    const onClick = vi.fn();
    render(
      <Dialog>
        <DialogTrigger onClick={onClick}>Open</DialogTrigger>
      </Dialog>,
    );
    await user.click(getButton('Open'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not open from a disabled trigger', async () => {
    render(
      <Dialog>
        <DialogTrigger disabled>Open</DialogTrigger>
      </Dialog>,
    );
    await user.click(getButton('Open'));
    expect(getButton('Open')).toHaveAttribute('aria-expanded', 'false');
  });

  it('forwards a ref to the trigger button', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Dialog>
        <DialogTrigger ref={ref}>Open</DialogTrigger>
      </Dialog>,
    );
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('throws when DialogTrigger is rendered outside <Dialog>', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<DialogTrigger>Open</DialogTrigger>)).toThrow(
      /must be rendered inside <Dialog>/,
    );
    spy.mockRestore();
  });
});
