import { Alert } from '@asnewyla/alert';
import { Stack } from '@asnewyla/layout';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/Alert',
  component: Alert,
  tags: ['autodocs'],
  argTypes: {
    tone: {
      control: 'select',
      options: ['error', 'success', 'info', 'warning'],
    },
    announce: { control: 'boolean' },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ErrorTone: Story = {
  args: { tone: 'error', children: 'Wrong email or password.' },
};

export const SuccessTone: Story = {
  args: { tone: 'success', children: 'Your password is changed.' },
};

export const InfoTone: Story = {
  args: {
    tone: 'info',
    children: 'Imports run overnight. You can leave this page.',
  },
};

export const WarningTone: Story = {
  args: {
    tone: 'warning',
    children: 'Your storage is 90% full.',
  },
};

export const WithTitleAndLink: StoryObj = {
  render: () => (
    <Alert tone="info" title="Import finished">
      312 photos and 18 videos were added.{' '}
      <a href="#summary">See the summary</a>.
    </Alert>
  ),
};

export const AllTones: StoryObj = {
  render: () => (
    <Stack gap="md">
      <Alert tone="error" title="Sign-in failed">
        Wrong email or password.
      </Alert>
      <Alert tone="success">Your password is changed.</Alert>
      <Alert tone="info">Imports run overnight.</Alert>
      <Alert tone="warning">Your storage is 90% full.</Alert>
    </Stack>
  ),
};

/** No role, so it isn't announced: for text that's part of the page. */
export const StaticText: Story = {
  args: {
    tone: 'warning',
    announce: false,
    children: 'This album is read-only.',
  },
};
