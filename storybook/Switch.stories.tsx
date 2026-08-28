import { Stack } from '@asnewyla/layout';
import { Switch } from '@asnewyla/switch';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/Switch',
  component: Switch,
  tags: ['autodocs'],
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Notifications',
  },
};

export const Checked: Story = {
  args: {
    label: 'Notifications',
    defaultChecked: true,
  },
};

export const WithError: Story = {
  args: {
    label: 'Notifications',
    error: 'Choose a notification setting to continue',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Notifications',
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    label: 'Notifications',
    disabled: true,
    defaultChecked: true,
  },
};

export const InAStack: StoryObj = {
  render: () => (
    <Stack gap="sm" style={{ width: 260 }}>
      <Switch label="Email notifications" defaultChecked />
      <Switch label="SMS notifications" />
      <Switch label="Push notifications" defaultChecked />
      <Switch
        label="Marketing emails"
        error="Choose a notification setting to continue"
      />
    </Stack>
  ),
};
