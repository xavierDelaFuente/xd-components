import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from '@asnewyla/input';
import { Stack } from '@asnewyla/layout';

const meta = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Name',
    placeholder: 'e.g. Jordan',
  },
};

export const WithError: Story = {
  args: {
    label: 'Email',
    defaultValue: 'not-an-email',
    error: 'Enter a valid email address',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Name',
    disabled: true,
    defaultValue: 'Jordan',
  },
};

export const InAStack: StoryObj = {
  render: () => (
    <Stack gap="md" style={{ width: 260 }}>
      <Input label="Name" placeholder="e.g. Jordan" />
      <Input
        label="Email"
        defaultValue="not-an-email"
        error="Enter a valid email address"
      />
    </Stack>
  ),
};
