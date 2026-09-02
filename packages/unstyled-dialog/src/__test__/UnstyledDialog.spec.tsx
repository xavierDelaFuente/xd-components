import { fireEvent, render, screen } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import { createRef } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '../components';
import { getButton, queryDialog } from '../test-utils';

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

describe('UnstyledDialog — content lifecycle', () => {
  function renderDialog(
    props: Partial<React.ComponentProps<typeof Dialog>> = {},
  ) {
    return render(
      <Dialog {...props}>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <p>Dialog body</p>
          <DialogClose>Close</DialogClose>
        </DialogContent>
      </Dialog>,
    );
  }

  it('does not show the dialog while closed', () => {
    renderDialog();
    expect(queryDialog()).toBeNull();
  });

  it('shows the dialog after the trigger is clicked', async () => {
    renderDialog();
    await user.click(getButton('Open'));
    expect(queryDialog()).toBeInTheDocument();
  });

  it('calls showModal (not show) when opening', async () => {
    const showModal = vi.spyOn(HTMLDialogElement.prototype, 'showModal');
    const show = vi.spyOn(HTMLDialogElement.prototype, 'show');
    renderDialog();
    await user.click(getButton('Open'));
    expect(showModal).toHaveBeenCalled();
    expect(show).not.toHaveBeenCalled();
    showModal.mockRestore();
    show.mockRestore();
  });

  it('renders its children inside the dialog', () => {
    renderDialog({ defaultOpen: true });
    expect(queryDialog()).toHaveTextContent('Dialog body');
  });

  it('sets data-state="open" while open', () => {
    renderDialog({ defaultOpen: true });
    expect(queryDialog()).toHaveAttribute('data-state', 'open');
  });

  it('closes when the native close event fires (Escape)', async () => {
    renderDialog({ defaultOpen: true });
    expect(queryDialog()).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(queryDialog()).toBeNull();
  });

  it('calls onOpenChange(false) when closed via Escape', () => {
    const onOpenChange = vi.fn();
    renderDialog({ defaultOpen: true, onOpenChange });
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('syncs the trigger aria-expanded back to false after closing', () => {
    renderDialog({ defaultOpen: true });
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(getButton('Open')).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes when a controlled open prop flips to false', () => {
    const { rerender } = render(
      <Dialog open>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <p>Body</p>
        </DialogContent>
      </Dialog>,
    );
    expect(queryDialog()).toBeInTheDocument();
    rerender(
      <Dialog open={false}>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <p>Body</p>
        </DialogContent>
      </Dialog>,
    );
    expect(queryDialog()).toBeNull();
  });

  it('does not fire onOpenChange again for its own programmatic close', () => {
    const onOpenChange = vi.fn();
    const { rerender } = render(
      <Dialog open onOpenChange={onOpenChange}>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <p>Body</p>
        </DialogContent>
      </Dialog>,
    );
    rerender(
      <Dialog open={false} onOpenChange={onOpenChange}>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <p>Body</p>
        </DialogContent>
      </Dialog>,
    );
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('closes on a click on the dialog backdrop (the dialog element itself)', () => {
    renderDialog({ defaultOpen: true });
    const dialog = queryDialog();
    if (dialog) {
      fireEvent.click(dialog);
    }
    expect(queryDialog()).toBeNull();
  });

  it('does not close on a click inside the dialog content', () => {
    renderDialog({ defaultOpen: true });
    fireEvent.click(screen.getByText('Dialog body'));
    expect(queryDialog()).toBeInTheDocument();
  });

  it('composes a consumer onClose handler', () => {
    const onClose = vi.fn();
    render(
      <Dialog defaultOpen>
        <DialogContent onClose={onClose}>
          <p>Body</p>
        </DialogContent>
      </Dialog>,
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('merges a custom className onto the dialog', () => {
    render(
      <Dialog defaultOpen>
        <DialogContent className="panel">
          <p>Body</p>
        </DialogContent>
      </Dialog>,
    );
    expect(queryDialog()).toHaveClass('panel');
  });

  it('forwards a ref to the dialog element', () => {
    const ref = createRef<HTMLDialogElement>();
    render(
      <Dialog defaultOpen>
        <DialogContent ref={ref}>
          <p>Body</p>
        </DialogContent>
      </Dialog>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDialogElement);
  });

  it('throws when DialogContent is rendered outside <Dialog>', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() =>
      render(
        <DialogContent>
          <p>Body</p>
        </DialogContent>,
      ),
    ).toThrow(/must be rendered inside <Dialog>/);
    spy.mockRestore();
  });
});

describe('UnstyledDialog — labelling', () => {
  it('renders DialogTitle as a heading with an id', () => {
    render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogTitle>Delete file</DialogTitle>
        </DialogContent>
      </Dialog>,
    );
    const title = screen.getByRole('heading', { name: 'Delete file' });
    expect(title).toHaveAttribute('id');
  });

  it('renders DialogDescription as a paragraph with an id', () => {
    render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogDescription>This cannot be undone.</DialogDescription>
        </DialogContent>
      </Dialog>,
    );
    const description = screen.getByText('This cannot be undone.');
    expect(description.tagName).toBe('P');
    expect(description).toHaveAttribute('id');
  });

  it('points the dialog aria-labelledby at the DialogTitle', () => {
    render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogTitle>Delete file</DialogTitle>
        </DialogContent>
      </Dialog>,
    );
    const title = screen.getByRole('heading', { name: 'Delete file' });
    expect(queryDialog()).toHaveAttribute('aria-labelledby', title.id);
  });

  it('points the dialog aria-describedby at the DialogDescription', () => {
    render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogDescription>This cannot be undone.</DialogDescription>
        </DialogContent>
      </Dialog>,
    );
    const description = screen.getByText('This cannot be undone.');
    expect(queryDialog()).toHaveAttribute('aria-describedby', description.id);
  });

  it('sets no aria-labelledby when there is no DialogTitle', () => {
    render(
      <Dialog defaultOpen>
        <DialogContent aria-label="Settings">
          <p>Body</p>
        </DialogContent>
      </Dialog>,
    );
    expect(queryDialog()).not.toHaveAttribute('aria-labelledby');
  });

  it('sets no aria-describedby when there is no DialogDescription', () => {
    render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogTitle>Title</DialogTitle>
        </DialogContent>
      </Dialog>,
    );
    expect(queryDialog()).not.toHaveAttribute('aria-describedby');
  });

  it('merges a custom className onto DialogTitle', () => {
    render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogTitle className="headline">Title</DialogTitle>
        </DialogContent>
      </Dialog>,
    );
    expect(screen.getByRole('heading', { name: 'Title' })).toHaveClass(
      'headline',
    );
  });

  it('throws when DialogTitle is rendered outside <Dialog>', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<DialogTitle>Title</DialogTitle>)).toThrow(
      /must be rendered inside <Dialog>/,
    );
    spy.mockRestore();
  });
});

describe('UnstyledDialog — close', () => {
  function renderOpen() {
    return render(
      <Dialog defaultOpen>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <p>Body</p>
          <DialogClose>Close</DialogClose>
        </DialogContent>
      </Dialog>,
    );
  }

  it('renders DialogClose as a button of type="button"', () => {
    renderOpen();
    expect(getButton('Close')).toHaveAttribute('type', 'button');
  });

  it('closes the dialog when DialogClose is clicked', async () => {
    renderOpen();
    await user.click(getButton('Close'));
    expect(queryDialog()).toBeNull();
  });

  it('calls onOpenChange(false) when DialogClose is clicked', async () => {
    const onOpenChange = vi.fn();
    render(
      <Dialog defaultOpen onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogClose>Close</DialogClose>
        </DialogContent>
      </Dialog>,
    );
    await user.click(getButton('Close'));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('composes a consumer onClick on DialogClose', async () => {
    const onClick = vi.fn();
    render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogClose onClick={onClick}>Close</DialogClose>
        </DialogContent>
      </Dialog>,
    );
    await user.click(getButton('Close'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('forwards a ref to the DialogClose button', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogClose ref={ref}>Close</DialogClose>
        </DialogContent>
      </Dialog>,
    );
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('throws when DialogClose is rendered outside <Dialog>', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<DialogClose>Close</DialogClose>)).toThrow(
      /must be rendered inside <Dialog>/,
    );
    spy.mockRestore();
  });
});
