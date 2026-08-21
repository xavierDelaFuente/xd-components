import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@asnewyla/button';
import { Group } from '@asnewyla/layout';

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'destructive'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: 'Save changes',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Cancel',
    variant: 'secondary',
  },
};

export const Destructive: Story = {
  args: {
    children: 'Delete account',
    variant: 'destructive',
  },
};

export const Sizes: Story = {
  render: () => (
    <Group gap="md" align="center">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </Group>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <Group gap="md">
      <Button startIcon={<span aria-hidden="true">💾</span>}>Save</Button>
      <Button endIcon={<span aria-hidden="true">→</span>}>Next</Button>
    </Group>
  ),
};

export const Disabled: Story = {
  args: {
    children: 'Cannot click',
    disabled: true,
  },
};

export const AsLink: Story = {
  args: {
    as: 'a',
    href: '#',
    children: 'I am a link',
  },
};
