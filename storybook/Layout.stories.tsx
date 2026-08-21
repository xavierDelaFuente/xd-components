import type { Meta, StoryObj } from '@storybook/react-vite';
import { Layout } from '@asnewyla/layout';

const chipStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 64,
  height: 40,
  background: 'var(--xd-color-secondary, #64748b)',
  color: 'var(--xd-on-secondary, #fff)',
  borderRadius: 'var(--xd-radius-sm, 4px)',
};

const Chip = ({ children }: { children: React.ReactNode }) => (
  <div style={chipStyle}>{children}</div>
);

const meta = {
  title: 'Components/Layout',
  component: Layout,
  tags: ['autodocs'],
  argTypes: {
    direction: {
      control: 'select',
      options: ['vertical', 'horizontal'],
    },
    gap: {
      control: 'select',
      options: [undefined, 'sm', 'md', 'lg'],
    },
    align: {
      control: 'select',
      options: [undefined, 'start', 'center', 'end'],
    },
    justify: {
      control: 'select',
      options: [undefined, 'start', 'center', 'end', 'between', 'around'],
    },
  },
} satisfies Meta<typeof Layout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Vertical: Story = {
  args: {
    direction: 'vertical',
    gap: 'md',
    children: (
      <>
        <Chip>A</Chip>
        <Chip>B</Chip>
        <Chip>C</Chip>
      </>
    ),
  },
};

export const Horizontal: Story = {
  args: {
    direction: 'horizontal',
    gap: 'md',
    children: (
      <>
        <Chip>A</Chip>
        <Chip>B</Chip>
        <Chip>C</Chip>
      </>
    ),
  },
};

export const GapSizes: StoryObj = {
  render: () => (
    <Layout direction="vertical" gap="lg">
      {(['sm', 'md', 'lg'] as const).map((gap) => (
        <Layout key={gap} direction="horizontal" gap={gap} align="center">
          <code>{gap}</code>
          <Chip>A</Chip>
          <Chip>B</Chip>
          <Chip>C</Chip>
        </Layout>
      ))}
    </Layout>
  ),
};

export const Wrap: Story = {
  args: {
    direction: 'horizontal',
    gap: 'sm',
    wrap: true,
    children: Array.from({ length: 10 }, (_, i) => <Chip key={i}>{i}</Chip>),
  },
  render: (args) => (
    <div style={{ width: 220, border: '1px dashed #94a3b8', padding: 8 }}>
      <Layout {...args} />
    </div>
  ),
};
