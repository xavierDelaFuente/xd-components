import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@asnewyla/button';
import { Group } from '@asnewyla/layout';

const meta = {
  title: 'Components/Group',
  component: Group,
  tags: ['autodocs'],
  argTypes: {
    gap: {
      control: 'select',
      options: [undefined, 'sm', 'md', 'lg'],
    },
    align: {
      control: 'select',
      options: [undefined, 'start', 'center', 'end'],
    },
  },
} satisfies Meta<typeof Group>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    gap: 'md',
    children: (
      <>
        <Button startIcon={<span aria-hidden="true">💾</span>}>Save</Button>
        <Button variant="secondary">Cancel</Button>
      </>
    ),
  },
};

export const AlignCenter: Story = {
  args: {
    gap: 'sm',
    align: 'center',
    children: (
      <>
        <Button size="sm">Small</Button>
        <Button size="lg">Large</Button>
      </>
    ),
  },
};
