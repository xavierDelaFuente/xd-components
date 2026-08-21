import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconButton } from '@asnewyla/icon-button';
import { Group } from '@asnewyla/layout';

const meta = {
  title: 'Components/IconButton',
  component: IconButton,
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
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

const SaveIcon = () => <span aria-hidden="true">💾</span>;

export const Primary: Story = {
  args: {
    icon: <SaveIcon />,
    label: 'Save file',
    variant: 'primary',
  },
};

export const AllVariants: StoryObj = {
  render: () => (
    <Group gap="md">
      <IconButton icon={<SaveIcon />} label="Save" variant="primary" />
      <IconButton icon={<SaveIcon />} label="Save" variant="secondary" />
      <IconButton icon={<SaveIcon />} label="Delete" variant="destructive" />
    </Group>
  ),
};

export const AllSizes: StoryObj = {
  render: () => (
    <Group gap="md" align="center">
      <IconButton icon={<SaveIcon />} label="Save" size="sm" />
      <IconButton icon={<SaveIcon />} label="Save" size="md" />
      <IconButton icon={<SaveIcon />} label="Save" size="lg" />
    </Group>
  ),
};

export const Disabled: Story = {
  args: {
    icon: <SaveIcon />,
    label: 'Save file',
    disabled: true,
  },
};
