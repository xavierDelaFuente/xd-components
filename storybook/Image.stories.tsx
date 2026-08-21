import type { Meta, StoryObj } from '@storybook/react-vite';
import { Image } from '@asnewyla/image';
import { Group, Stack } from '@asnewyla/layout';

const photo =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200"><rect width="320" height="200" fill="#0d9488"/><text x="50%" y="50%" fill="white" font-family="sans-serif" font-size="20" text-anchor="middle" dominant-baseline="middle">Photo</text></svg>',
  );

const fallback =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200"><rect width="320" height="200" fill="#94a3b8"/><text x="50%" y="50%" fill="white" font-family="sans-serif" font-size="20" text-anchor="middle" dominant-baseline="middle">Fallback</text></svg>',
  );

const meta = {
  title: 'Components/Image',
  component: Image,
  tags: ['autodocs'],
} satisfies Meta<typeof Image>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    src: photo,
    alt: 'Placeholder photo',
  },
};

export const AspectRatioAndRadius: Story = {
  args: {
    src: photo,
    alt: 'Placeholder photo, square with rounded corners',
    aspectRatio: '1 / 1',
    radius: 'lg',
  },
  render: (args) => (
    <div style={{ width: 200 }}>
      <Image {...args} />
    </div>
  ),
};

export const Fit: StoryObj = {
  render: () => (
    <Group gap="md">
      {(['cover', 'contain', 'fill'] as const).map((fit) => (
        <Stack key={fit} gap="sm" align="center">
          <div style={{ width: 150, height: 100, border: '1px dashed #94a3b8' }}>
            <Image
              src={photo}
              alt={`Fit mode: ${fit}`}
              fit={fit}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
          <code>{fit}</code>
        </Stack>
      ))}
    </Group>
  ),
};

export const BrokenWithFallback: Story = {
  args: {
    src: '/this-image-does-not-exist.jpg',
    alt: 'Broken image, falls back to a placeholder',
    fallback,
  },
};

export const DecorativeEmptyAlt: Story = {
  args: {
    src: photo,
    alt: '',
  },
};
