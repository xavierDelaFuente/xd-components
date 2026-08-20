import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@xd/button';
import { ButtonGroup } from '@xd/button-group';

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
