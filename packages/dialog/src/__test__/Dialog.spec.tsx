import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '../components';

function renderDialog() {
  return render(
    <Dialog defaultOpen>
      <DialogTrigger>Open</DialogTrigger>
      <DialogContent>
        <DialogTitle>Delete file</DialogTitle>
        <DialogDescription>This cannot be undone.</DialogDescription>
        <DialogClose>Close</DialogClose>
      </DialogContent>
    </Dialog>,
  );
}

describe('Dialog (styled)', () => {
  it('applies the base xd-dialog-trigger class', () => {
    renderDialog();
    expect(screen.getByRole('button', { name: 'Open' })).toHaveClass(
      'xd-dialog-trigger',
    );
  });

  it('applies the base xd-dialog class to the content', () => {
    renderDialog();
    expect(screen.getByRole('dialog')).toHaveClass('xd-dialog');
  });

  it('merges a consumer className onto the content, base class first', () => {
    render(
      <Dialog defaultOpen>
        <DialogContent className="wide">
          <p>Body</p>
        </DialogContent>
      </Dialog>,
    );
    expect(screen.getByRole('dialog')).toHaveClass('xd-dialog', 'wide');
  });

  it('defaults data-position to "center"', () => {
    renderDialog();
    expect(screen.getByRole('dialog')).toHaveAttribute(
      'data-position',
      'center',
    );
  });

  it('respects an explicit position prop', () => {
    render(
      <Dialog defaultOpen>
        <DialogContent position="right">
          <p>Body</p>
        </DialogContent>
      </Dialog>,
    );
    expect(screen.getByRole('dialog')).toHaveAttribute(
      'data-position',
      'right',
    );
  });

  it('applies the base xd-dialog-title and xd-dialog-description classes', () => {
    renderDialog();
    expect(screen.getByRole('heading', { name: 'Delete file' })).toHaveClass(
      'xd-dialog-title',
    );
    expect(screen.getByText('This cannot be undone.')).toHaveClass(
      'xd-dialog-description',
    );
  });

  it('applies the base xd-dialog-close class', () => {
    renderDialog();
    expect(screen.getByRole('button', { name: 'Close' })).toHaveClass(
      'xd-dialog-close',
    );
  });

  it('forwards a ref to the dialog content element', () => {
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

  it('still opens and closes like the primitive', async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogClose>Close</DialogClose>
        </DialogContent>
      </Dialog>,
    );
    expect(screen.queryByRole('dialog')).toBeNull();
    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('still wires aria-labelledby/aria-describedby from Title/Description', () => {
    renderDialog();
    const dialog = screen.getByRole('dialog');
    const title = screen.getByRole('heading', { name: 'Delete file' });
    const description = screen.getByText('This cannot be undone.');
    expect(dialog).toHaveAttribute('aria-labelledby', title.id);
    expect(dialog).toHaveAttribute('aria-describedby', description.id);
  });
});
