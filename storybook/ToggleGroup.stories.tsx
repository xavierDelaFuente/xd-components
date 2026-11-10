import { Stack } from '@asnewyla/layout';
import { ToggleGroup, ToggleGroupItem } from '@asnewyla/toggle-group';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/ToggleGroup',
  component: ToggleGroup,
  tags: ['autodocs'],
} satisfies Meta<typeof ToggleGroup>;

export default meta;

export const Default: StoryObj = {
  render: () => (
    <ToggleGroup aria-label="Colour mode" name="mode">
      <ToggleGroupItem value="system">System</ToggleGroupItem>
      <ToggleGroupItem value="light">Light</ToggleGroupItem>
      <ToggleGroupItem value="dark">Dark</ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const Sizes: StoryObj = {
  render: () => (
    <Stack gap="lg" align="start">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <ToggleGroup key={size} aria-label={`View (${size})`} size={size}>
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
      <ToggleGroup aria-labelledby="media-filter" size="sm">
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
      <ToggleGroup aria-label="Colour mode (all disabled)" disabled>
        <ToggleGroupItem value="system">System</ToggleGroupItem>
        <ToggleGroupItem value="light">Light</ToggleGroupItem>
        <ToggleGroupItem value="dark">Dark</ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup aria-label="Status (one disabled)">
        <ToggleGroupItem value="draft">Draft</ToggleGroupItem>
        <ToggleGroupItem value="published">Published</ToggleGroupItem>
        <ToggleGroupItem value="archived" disabled>
          Archived
        </ToggleGroupItem>
      </ToggleGroup>
    </Stack>
  ),
};
