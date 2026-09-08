import { Group, Stack } from '@asnewyla/layout';
import { Skeleton, Spinner } from '@asnewyla/spinner';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/Spinner',
  component: Spinner,
  tags: ['autodocs'],
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: StoryObj = {
  render: () => (
    <Group gap="lg" align="center">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Stack key={size} gap="sm" align="center">
          <Spinner size={size} />
          <small>{size}</small>
        </Stack>
      ))}
    </Group>
  ),
};

export const WithLabel: Story = {
  args: {
    label: 'Loading results',
    size: 'lg',
  },
};

export const OnADarkSurface: StoryObj = {
  render: () => (
    <div
      style={{
        padding: '2rem',
        borderRadius: 8,
        background: '#0f172a',
        color: '#e2e8f0',
      }}
    >
      <Spinner size="lg" />
    </div>
  ),
};

export const SkeletonTextBlock: StoryObj = {
  name: 'Skeleton — text block',
  render: () => (
    <Stack gap="sm" style={{ width: 320 }} aria-busy="true" aria-live="polite">
      <Skeleton width="55%" height={20} />
      <Skeleton />
      <Skeleton />
      <Skeleton width="80%" />
    </Stack>
  ),
};

export const SkeletonCard: StoryObj = {
  name: 'Skeleton — media card',
  render: () => (
    <Stack gap="md" style={{ width: 280 }} aria-busy="true" aria-live="polite">
      <Skeleton width="100%" height={160} radius="md" />
      <Group gap="sm" align="center">
        <Skeleton width={40} height={40} radius="full" />
        <Stack gap="sm" style={{ flex: 1 }}>
          <Skeleton width="60%" height={12} />
          <Skeleton width="40%" height={12} />
        </Stack>
      </Group>
      <Skeleton />
      <Skeleton width="90%" />
    </Stack>
  ),
};

export const SkeletonRadii: StoryObj = {
  name: 'Skeleton — radius scale',
  render: () => (
    <Group gap="md" align="center">
      {(['sm', 'md', 'lg', 'full'] as const).map((radius) => (
        <Stack key={radius} gap="sm" align="center">
          <Skeleton width={64} height={64} radius={radius} />
          <small>{radius}</small>
        </Stack>
      ))}
    </Group>
  ),
};
