import { Group, Stack } from '@asnewyla/layout';
import { Video } from '@asnewyla/video';
import type { Meta, StoryObj } from '@storybook/react-vite';

// Short, long-lived public sample clips — Storybook is a dev tool and renders in
// a real browser with network access. The package itself ships no assets.
const mp4 = 'https://www.w3schools.com/html/mov_bbb.mp4';

const poster =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360"><rect width="640" height="360" fill="#0f766e"/><polygon points="280,140 280,220 360,180" fill="white"/></svg>',
  );

// A caption track as a data URI, so the a11y story needs no bundled .vtt file.
const captions =
  'data:text/vtt,' +
  encodeURIComponent(
    'WEBVTT\n\n00:00.000 --> 00:04.000\nA rabbit steps out of its burrow.\n\n00:04.000 --> 00:08.000\nThree rodents drop from the tree above.\n',
  );

const meta = {
  title: 'Components/Video',
  component: Video,
  tags: ['autodocs'],
} satisfies Meta<typeof Video>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    src: mp4,
    poster,
    controls: true,
  },
  render: (args) => (
    <div style={{ width: 480 }}>
      <Video {...args} />
    </div>
  ),
};

export const AspectRatioAndRadius: Story = {
  args: {
    src: mp4,
    poster,
    controls: true,
    aspectRatio: '16 / 9',
    radius: 'lg',
  },
  render: (args) => (
    <div style={{ width: 480 }}>
      <Video {...args} />
    </div>
  ),
};

export const Fit: StoryObj = {
  render: () => (
    <Group gap="md">
      {(['cover', 'contain', 'fill'] as const).map((fit) => (
        <Stack key={fit} gap="sm" align="center">
          <div
            style={{ width: 160, height: 160, border: '1px dashed #94a3b8' }}
          >
            <Video
              src={mp4}
              poster={poster}
              fit={fit}
              muted
              style={{ width: '100%', height: '100%' }}
            />
          </div>
          <code>{fit}</code>
        </Stack>
      ))}
    </Group>
  ),
};

// Muted + autoPlay + loop + playsInline is the "ambient background clip" recipe —
// the only configuration browsers allow to start playing without a user gesture.
export const AutoplayBackground: Story = {
  args: {
    src: mp4,
    autoPlay: true,
    loop: true,
    muted: true,
    playsInline: true,
    radius: 'md',
    aspectRatio: '16 / 9',
  },
  render: (args) => (
    <div style={{ width: 480 }}>
      <Video {...args} />
    </div>
  ),
};

export const BrokenWithFallback: Story = {
  args: {
    src: '/this-video-does-not-exist.mp4',
    fallback: mp4,
    poster,
    controls: true,
  },
  render: (args) => (
    <div style={{ width: 480 }}>
      <Video {...args} />
    </div>
  ),
};

// Captions come through as a native <track> child — no dedicated prop.
export const WithCaptions: Story = {
  args: {
    src: mp4,
    poster,
    controls: true,
  },
  render: (args) => (
    <div style={{ width: 480 }}>
      <Video {...args}>
        <track
          kind="captions"
          srcLang="en"
          label="English"
          src={captions}
          default
        />
      </Video>
    </div>
  ),
};
