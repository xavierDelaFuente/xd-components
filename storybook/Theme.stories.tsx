import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@asnewyla/button';
import { Card } from '@asnewyla/card';
import { Group, Stack } from '@asnewyla/layout';
import { ThemeProvider } from '@asnewyla/theme';
import '@asnewyla/tokens/theme-paper.css';
import '@asnewyla/tokens/theme-sand.css';
import '@asnewyla/tokens/theme-lavender.css';

const themeNames = ['paper', 'sand', 'lavender'] as const;

function ThemedDemo() {
  return (
    <Stack gap="md" style={{ width: 280 }}>
      <Group gap="sm">
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

const meta = {
  title: 'Foundations/Theme',
  component: ThemeProvider,
  tags: ['autodocs'],
  argTypes: {
    theme: {
      control: 'select',
      options: themeNames,
    },
  },
} satisfies Meta<typeof ThemeProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LiveSwitcher: Story = {
  args: {
    theme: 'paper',
    children: <ThemedDemo />,
  },
  render: (args) => (
    <ThemeProvider theme={args.theme}>{args.children}</ThemeProvider>
  ),
};

export const AllThemes: StoryObj = {
  render: () => (
    // Deliberately *not* three <ThemeProvider>s: ThemeProvider sets
    // data-theme on document.documentElement, so mounting several at once
    // would just have the last one to run its effect win for the whole
    // page — only one theme can be active document-wide at a time. This
    // comparison view instead uses the underlying [data-theme] CSS
    // mechanism directly, scoped to each wrapper.
    <Group gap="lg" align="start">
      {themeNames.map((theme) => (
        <div key={theme} data-theme={theme}>
          <ThemedDemo />
        </div>
      ))}
    </Group>
  ),
};
