import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from '@asnewyla/checkbox';
import { Stack } from '@asnewyla/layout';

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Accept terms',
  },
};

export const Checked: Story = {
  args: {
    label: 'Accept terms',
    defaultChecked: true,
  },
};

export const Indeterminate: Story = {
  args: {
    label: 'Select all',
    indeterminate: true,
  },
};

export const WithError: Story = {
  args: {
    label: 'Accept terms',
    error: 'You must accept the terms to continue',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Accept terms',
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    label: 'Accept terms',
    disabled: true,
    defaultChecked: true,
  },
};

export const InAStack: StoryObj = {
  render: () => (
    <Stack gap="sm" style={{ width: 260 }}>
      <Checkbox label="Email notifications" defaultChecked />
      <Checkbox label="SMS notifications" />
      <Checkbox label="Push notifications" defaultChecked />
      <Checkbox
        label="Accept terms"
        error="You must accept the terms to continue"
      />
    </Stack>
  ),
};
