import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from '@asnewyla/card';
import { Grid } from '@asnewyla/layout';

const chipStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 48,
  background: 'var(--xd-color-secondary, #64748b)',
  color: 'var(--xd-on-secondary, #fff)',
  borderRadius: 'var(--xd-radius-sm, 4px)',
};

const Chip = ({ children }: { children: React.ReactNode }) => (
  <div style={chipStyle}>{children}</div>
);

const meta = {
  title: 'Components/Grid',
  component: Grid,
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
    justify: {
      control: 'select',
      options: [undefined, 'start', 'center', 'end'],
    },
  },
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ThreeColumns: Story = {
  args: {
    columns: 3,
    gap: 'md',
    children: Array.from({ length: 6 }, (_, i) => <Chip key={i}>{i + 1}</Chip>),
  },
  render: (args) => (
    <div style={{ width: 320 }}>
      <Grid {...args} />
    </div>
  ),
};

export const CardGrid: StoryObj = {
  render: () => (
    <div style={{ width: 480 }}>
      <Grid columns={2} gap="md">
        {Array.from({ length: 4 }, (_, i) => (
          <Card key={i} radius="md">
            <h4>Item {i + 1}</h4>
            <p>Card contents laid out in a 2-column grid.</p>
          </Card>
        ))}
      </Grid>
    </div>
  ),
};

export const CustomColumnTracks: StoryObj = {
  render: () => (
    <div style={{ width: 480 }}>
      <Grid columns="200px 1fr 200px" gap="sm">
        <Chip>Sidebar</Chip>
        <Chip>Main</Chip>
        <Chip>Aside</Chip>
      </Grid>
    </div>
  ),
};

export const AlignAndJustify: StoryObj = {
  render: () => (
    <div style={{ width: 320, border: '1px dashed #94a3b8', padding: 8 }}>
      <Grid
        columns={2}
        gap="md"
        align="center"
        justify="center"
        style={{ height: 160 }}
      >
        <div style={{ ...chipStyle, width: 40 }}>A</div>
        <div style={{ ...chipStyle, width: 60, height: 60 }}>B</div>
      </Grid>
    </div>
  ),
};
