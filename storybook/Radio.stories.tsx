import type { Meta, StoryObj } from '@storybook/react-vite';
import { Radio } from '@asnewyla/radio';
import { RadioGroup } from '@asnewyla/radio-group';
import { Stack } from '@asnewyla/layout';

const meta = {
  title: 'Components/Radio',
  component: Radio,
  tags: ['autodocs'],
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Option A',
  },
};

export const Checked: Story = {
  args: {
    label: 'Option A',
    defaultChecked: true,
  },
};

export const WithError: Story = {
  args: {
    label: 'Option A',
    error: 'You must choose an option',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Option A',
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    label: 'Option A',
    disabled: true,
    defaultChecked: true,
  },
};

export const InAGroup: StoryObj = {
  render: () => (
    <RadioGroup name="size-demo" defaultValue="sm">
      <Stack gap="sm" style={{ width: 260 }}>
        <Radio label="Small" value="sm" />
        <Radio label="Medium" value="md" />
        <Radio label="Large" value="lg" />
      </Stack>
    </RadioGroup>
  ),
};
