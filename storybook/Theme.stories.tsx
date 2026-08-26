import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@asnewyla/button';
import { Card } from '@asnewyla/card';
import { Group, Stack } from '@asnewyla/layout';
import { ThemeProvider } from '@asnewyla/theme';
import '@asnewyla/tokens/theme-terra.css';
import '@asnewyla/tokens/theme-almanac.css';
import '@asnewyla/tokens/theme-block.css';
import '@asnewyla/tokens/theme-graphite.css';
import '@asnewyla/tokens/theme-rubber.css';
import '@asnewyla/tokens/theme-terminal.css';

const themeNames = [
  'terra',
  'almanac',
  'block',
  'graphite',
  'rubber',
  'terminal',
] as const;

function ThemedDemo() {
  return (
    <Stack gap="md" style={{ width: 260 }}>
      <Group gap="sm" wrap>
        <Button size="sm">Primary</Button>
        <Button size="sm" variant="secondary">
          Secondary
        </Button>
        <Button size="sm" variant="destructive">
          Destructive
        </Button>
      </Group>
      <Card padding="md" radius="md">
        <h4 style={{ margin: 0 }}>Card title</h4>
        <p style={{ margin: 0 }}>
          Radius, border, and primary color all come from the active theme's
          tokens — nothing here is Theme-aware itself.
        </p>
      </Card>
    </Stack>
  );
}

// Every theme's light-mode surface is a barely-tinted near-white (96.5-100%
// lightness by design — see tokens.css for the measured values), so two
// theme cards side by side can look like the same flat white without a
// border of their own to actually separate them from the page and from
// each other. This wrapper is comparison-view chrome, not theme-aware
// styling — same "border: 1px solid #ccc" role a designer's own page
// layout would play around a mounted <ThemeProvider>. `data-theme`/
// `data-mode` live on this same element so its own `background-color`
// (set by the theme file's `[data-theme="x"] { background-color: ... }`
// rule) already matches, with no separate inline background needed.
function ThemeCard({
  theme,
  mode,
  children,
}: {
  theme: string;
  mode?: 'light' | 'dark';
  children: React.ReactNode;
}) {
  return (
    <div
      data-theme={theme}
      data-mode={mode}
      style={{
        border: '1px solid var(--xd-color-border-strong, #94a3b8)',
        borderRadius: 'var(--xd-radius-md, 6px)',
        padding: '1rem',
      }}
    >
      {children}
    </div>
  );
}

const meta = {
  title: 'Foundations/Theme',
  component: ThemeProvider,
  tags: ['autodocs'],
  argTypes: {
    theme: {
      control: 'select',
      options: themeNames,
    },
    mode: {
      control: 'select',
      options: [undefined, 'light', 'dark'],
    },
  },
} satisfies Meta<typeof ThemeProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LiveSwitcher: Story = {
  args: {
    theme: 'terra',
    children: <ThemedDemo />,
  },
  render: (args) => (
    <ThemeProvider theme={args.theme} mode={args.mode}>
      {args.children}
    </ThemeProvider>
  ),
};

export const LightAndDark: StoryObj = {
  render: () => (
    // Same reasoning as AllThemes below: two <ThemeProvider>s can't be
    // active on the shared document root at once, so this comparison view
    // sets [data-theme]/[data-mode] directly on each wrapper instead.
    // `wrap` keeps this readable instead of forcing a horizontal scrollbar
    // in a narrow viewport (e.g. the Storybook docs-page iframe).
    <Group gap="lg" align="start" wrap>
      <ThemeCard theme="terra" mode="light">
        <ThemedDemo />
      </ThemeCard>
      <ThemeCard theme="terra" mode="dark">
        <ThemedDemo />
      </ThemeCard>
    </Group>
  ),
};

export const AllThemes: StoryObj = {
  render: () => (
    // Deliberately *not* three <ThemeProvider>s: ThemeProvider sets
    // data-theme on document.documentElement, so mounting several at once
    // would just have the last one to run its effect win for the whole
    // page — only one theme can be active document-wide at a time. This
    // comparison view instead uses the underlying [data-theme] CSS
    // mechanism directly, scoped to each wrapper. `wrap` lets the six
    // cards flow onto multiple rows instead of forcing one wide,
    // horizontally-scrolling row.
    <Group gap="lg" align="start" wrap>
      {themeNames.map((theme) => (
        <ThemeCard key={theme} theme={theme}>
          <ThemedDemo />
        </ThemeCard>
      ))}
    </Group>
  ),
};
