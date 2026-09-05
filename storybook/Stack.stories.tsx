import { Input } from '@asnewyla/input';
import { Stack } from '@asnewyla/layout';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/Stack',
  component: Stack,
  tags: ['autodocs'],
  argTypes: {
    gap: {
      control: 'select',
      options: [undefined, 'sm', 'md', 'lg'],
    },
  },
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    gap: 'md',
    style: { width: 220 },
    children: (
      <>
        <Input label="Name" />
        <Input label="Email" type="email" />
        <Input label="Password" type="password" />
      </>
    ),
  },
};

export const GapSizes: StoryObj = {
  render: () => (
    <Stack gap="lg">
      {(['sm', 'md', 'lg'] as const).map((gap) => (
        <Stack key={gap} gap={gap} style={{ width: 220 }}>
          <code>{gap}</code>
          <Input label="Name" />
          <Input label="Email" type="email" />
        </Stack>
      ))}
    </Stack>
  ),
};
