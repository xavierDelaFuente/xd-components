import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack } from '@asnewyla/layout';

const fieldStyle: React.CSSProperties = {
  padding: '0.5rem 0.75rem',
  border: '1px solid #cbd5e1',
  borderRadius: 'var(--xd-radius-sm, 4px)',
  width: 220,
};

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
    children: (
      <>
        <div style={fieldStyle}>Name</div>
        <div style={fieldStyle}>Email</div>
        <div style={fieldStyle}>Password</div>
      </>
    ),
  },
};

export const GapSizes: StoryObj = {
  render: () => (
    <Stack gap="lg">
      {(['sm', 'md', 'lg'] as const).map((gap) => (
        <Stack key={gap} gap={gap}>
          <code>{gap}</code>
          <div style={fieldStyle}>Name</div>
          <div style={fieldStyle}>Email</div>
        </Stack>
      ))}
    </Stack>
  ),
};
