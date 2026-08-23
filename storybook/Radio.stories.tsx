import type { Meta, StoryObj } from '@storybook/react-vite';
import { Radio } from '@asnewyla/radio';
import { Stack } from '@asnewyla/layout';
import { useState } from 'react';

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

function ControlledGroupDemo() {
  // Controlled, not several bare uncontrolled Radios sharing `name` — an
  // uncontrolled sibling's own data-checked can go stale when another
  // radio in its group is selected instead, since browsers don't fire a
  // change event on the deselected radio. Controlling `checked` here
  // sidesteps that entirely; see @asnewyla/unstyled-radio's README for
  // the underlying limitation RadioGroup (planned) exists to fix.
  const [size, setSize] = useState<'sm' | 'md' | 'lg'>('sm');

  return (
    <Stack gap="sm" style={{ width: 260 }}>
      <Radio
        label="Small"
        name="size-demo"
        checked={size === 'sm'}
        onChange={() => setSize('sm')}
      />
      <Radio
        label="Medium"
        name="size-demo"
        checked={size === 'md'}
        onChange={() => setSize('md')}
      />
      <Radio
        label="Large"
        name="size-demo"
        checked={size === 'lg'}
        onChange={() => setSize('lg')}
      />
    </Stack>
  );
}

export const InAStack: StoryObj = {
  render: () => <ControlledGroupDemo />,
};
