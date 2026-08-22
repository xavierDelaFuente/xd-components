import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from '@asnewyla/card';
import { Group } from '@asnewyla/layout';

const photo =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="560" height="280"><rect width="560" height="280" fill="#0d9488"/><text x="50%" y="50%" fill="white" font-family="sans-serif" font-size="24" text-anchor="middle" dominant-baseline="middle">Photo</text></svg>',
  );

const meta = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;

export const Default: StoryObj = {
  render: () => (
    <Card style={{ width: 280 }}>
      <h3>Card title</h3>
      <p>Some supporting body text for the card.</p>
    </Card>
  ),
};

export const WithImage: StoryObj = {
  render: () => (
    <Card
      style={{ width: 280 }}
      radius="md"
      image={{
        src: photo,
        alt: 'Placeholder photo',
        aspectRatio: '2 / 1',
      }}
    >
      <h3>Mountain view</h3>
      <p>Full-bleed image, clipped to the card's own radius.</p>
    </Card>
  ),
};

export const PaddingSizes: StoryObj = {
  render: () => (
    <Group gap="md">
      {(['sm', 'md', 'lg'] as const).map((padding) => (
        <Card key={padding} padding={padding} style={{ width: 200 }}>
          <p>padding=&quot;{padding}&quot;</p>
        </Card>
      ))}
    </Group>
  ),
};

export const RadiusSizes: StoryObj = {
  render: () => (
    <Group gap="md">
      {(['sm', 'md', 'lg', 'full'] as const).map((radius) => (
        <Card key={radius} radius={radius} style={{ width: 200 }}>
          <p>radius=&quot;{radius}&quot;</p>
        </Card>
      ))}
    </Group>
  ),
};
