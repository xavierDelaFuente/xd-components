import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@asnewyla/button';
import { ButtonGroup } from '@asnewyla/button-group';
import { Stack } from '@asnewyla/layout';

const meta = {
  title: 'Components/ButtonGroup',
  component: ButtonGroup,
  tags: ['autodocs'],
} satisfies Meta<typeof ButtonGroup>;

export default meta;

export const Default: StoryObj = {
  render: () => (
    <ButtonGroup aria-label="Text formatting">
      <Button>Bold</Button>
      <Button>Italic</Button>
      <Button>Underline</Button>
    </ButtonGroup>
  ),
};

export const SecondaryVariant: StoryObj = {
  render: () => (
    <ButtonGroup variant="secondary" aria-label="Text alignment">
      <Button>Left</Button>
      <Button>Center</Button>
      <Button>Right</Button>
    </ButtonGroup>
  ),
};

export const WithIndividualOverride: StoryObj = {
  render: () => (
    <ButtonGroup variant="secondary" aria-label="Actions">
      <Button>Keep</Button>
      <Button variant="destructive">Delete</Button>
    </ButtonGroup>
  ),
};

export const Disabled: StoryObj = {
  render: () => (
    <ButtonGroup disabled aria-label="Disabled actions">
      <Button>Save</Button>
      <Button>Cancel</Button>
    </ButtonGroup>
  ),
};

export const Gaps: StoryObj = {
  render: () => (
    <Stack gap="lg" align="start">
      {(['sm', 'md', 'lg'] as const).map((gap) => (
        <ButtonGroup key={gap} gap={gap} aria-label={`Formatting (gap ${gap})`}>
          <Button>Bold</Button>
          <Button>Italic</Button>
          <Button>Underline</Button>
        </ButtonGroup>
      ))}
    </Stack>
  ),
};
