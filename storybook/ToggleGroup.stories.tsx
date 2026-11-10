import { Stack } from '@asnewyla/layout';
import { ToggleGroup, ToggleGroupItem } from '@asnewyla/toggle-group';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

const meta = {
  title: 'Components/ToggleGroup',
  component: ToggleGroup,
  tags: ['autodocs'],
} satisfies Meta<typeof ToggleGroup>;

export default meta;

export const Default: StoryObj = {
  render: () => (
    <ToggleGroup aria-label="Colour mode" name="mode" defaultValue="system">
      <ToggleGroupItem value="system">System</ToggleGroupItem>
      <ToggleGroupItem value="light">Light</ToggleGroupItem>
      <ToggleGroupItem value="dark">Dark</ToggleGroupItem>
    </ToggleGroup>
  ),
};

function ControlledDemo() {
  const [mode, setMode] = useState('light');
  return (
    <Stack gap="sm" align="start">
      <ToggleGroup
        aria-label="Colour mode"
        value={mode}
        onValueChange={setMode}
      >
        <ToggleGroupItem value="system">System</ToggleGroupItem>
        <ToggleGroupItem value="light">Light</ToggleGroupItem>
        <ToggleGroupItem value="dark">Dark</ToggleGroupItem>
      </ToggleGroup>
      <p>
        Selected: <code>{mode}</code>
      </p>
    </Stack>
  );
}

export const Controlled: StoryObj = {
  render: () => <ControlledDemo />,
};

/** `value` with no `onValueChange`: the pressed item comes from the server
 * and clicks don't move it. In an app, items would be `type="submit"`. */
export const ServerDriven: StoryObj = {
  render: () => (
    <ToggleGroup aria-label="Colour mode" name="mode" value="dark">
      <ToggleGroupItem value="system">System</ToggleGroupItem>
      <ToggleGroupItem value="light">Light</ToggleGroupItem>
      <ToggleGroupItem value="dark">Dark</ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const Gaps: StoryObj = {
  render: () => (
    <Stack gap="lg" align="start">
      {(['sm', 'md', 'lg'] as const).map((gap) => (
        <ToggleGroup
          key={gap}
          aria-label={`View (gap ${gap})`}
          gap={gap}
          defaultValue="list"
        >
          <ToggleGroupItem value="list">List</ToggleGroupItem>
          <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
          <ToggleGroupItem value="board">Board</ToggleGroupItem>
        </ToggleGroup>
      ))}
    </Stack>
  ),
};

export const Sizes: StoryObj = {
  render: () => (
    <Stack gap="lg" align="start">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <ToggleGroup
          key={size}
          aria-label={`View (${size})`}
          size={size}
          defaultValue="grid"
        >
          <ToggleGroupItem value="list">List</ToggleGroupItem>
          <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
          <ToggleGroupItem value="board">Board</ToggleGroupItem>
        </ToggleGroup>
      ))}
    </Stack>
  ),
};

export const LabelledByHeading: StoryObj = {
  render: () => (
    <Stack gap="sm" align="start">
      <h3 id="media-filter">Media</h3>
      <ToggleGroup aria-labelledby="media-filter" size="sm" defaultValue="all">
        <ToggleGroupItem value="all">All</ToggleGroupItem>
        <ToggleGroupItem value="photos">Photos</ToggleGroupItem>
        <ToggleGroupItem value="videos">Videos</ToggleGroupItem>
        <ToggleGroupItem value="notes">Notes</ToggleGroupItem>
      </ToggleGroup>
    </Stack>
  ),
};

export const Disabled: StoryObj = {
  render: () => (
    <Stack gap="lg" align="start">
      <ToggleGroup
        aria-label="Colour mode (all disabled)"
        disabled
        defaultValue="light"
      >
        <ToggleGroupItem value="system">System</ToggleGroupItem>
        <ToggleGroupItem value="light">Light</ToggleGroupItem>
        <ToggleGroupItem value="dark">Dark</ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup aria-label="Status (one disabled)" defaultValue="draft">
        <ToggleGroupItem value="draft">Draft</ToggleGroupItem>
        <ToggleGroupItem value="published">Published</ToggleGroupItem>
        <ToggleGroupItem value="archived" disabled>
          Archived
        </ToggleGroupItem>
      </ToggleGroup>
    </Stack>
  ),
};
