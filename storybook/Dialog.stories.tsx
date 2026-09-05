import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  type DialogPosition,
  DialogTitle,
  DialogTrigger,
} from '@asnewyla/dialog';
import { Group } from '@asnewyla/layout';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof Dialog> = {
  title: 'Components/Dialog',
  component: Dialog,
  tags: ['autodocs'],
};

export default meta;

export const Default: StoryObj = {
  render: () => (
    <Dialog>
      <DialogTrigger>Delete file</DialogTrigger>
      <DialogContent>
        <DialogTitle>Delete file</DialogTitle>
        <DialogDescription>
          This will permanently delete "report.pdf". This cannot be undone.
        </DialogDescription>
        <Group gap="sm" justify="end">
          <DialogClose>Cancel</DialogClose>
          <DialogClose>Delete</DialogClose>
        </Group>
      </DialogContent>
    </Dialog>
  ),
};

// left/right render as a full-height sheet pinned to that edge; bottom renders
// as a full-width sheet with rounded top corners. center relies on the native
// <dialog>'s own centering — no extra CSS at all.
export const Positions: StoryObj = {
  render: () => (
    <Group gap="sm">
      {(
        [
          'center',
          'left',
          'right',
          'bottom',
        ] as const satisfies DialogPosition[]
      ).map((position) => (
        <Dialog key={position}>
          <DialogTrigger>{position}</DialogTrigger>
          <DialogContent position={position}>
            <DialogTitle>Position: {position}</DialogTitle>
            <DialogDescription>
              {position === 'center'
                ? 'The default — a centered modal.'
                : `Pinned to the ${position} edge as a sheet.`}
            </DialogDescription>
            <DialogClose>Close</DialogClose>
          </DialogContent>
        </Dialog>
      ))}
    </Group>
  ),
};

// No dedicated AlertDialog preset yet — role="alertdialog" passes straight
// through to DialogContent's native <dialog> since it extends the ordinary
// HTML attributes.
export const ConfirmationWithAlertRole: StoryObj = {
  render: () => (
    <Dialog>
      <DialogTrigger>Empty trash</DialogTrigger>
      <DialogContent role="alertdialog">
        <DialogTitle>Empty trash?</DialogTitle>
        <DialogDescription>
          24 items will be permanently deleted.
        </DialogDescription>
        <Group gap="sm" justify="end">
          <DialogClose>Cancel</DialogClose>
          <DialogClose>Empty trash</DialogClose>
        </Group>
      </DialogContent>
    </Dialog>
  ),
};
