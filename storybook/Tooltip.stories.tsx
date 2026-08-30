import { Group } from '@asnewyla/layout';
import { Tooltip, TooltipContent, TooltipTrigger } from '@asnewyla/tooltip';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: {
    // The tooltip renders next to its trigger — give it room to show.
    layout: 'centered',
  },
};

export default meta;

export const Default: StoryObj = {
  render: () => (
    <Tooltip>
      <TooltipTrigger>
        <button type="button">Hover or focus me</button>
      </TooltipTrigger>
      <TooltipContent>Saves your work automatically</TooltipContent>
    </Tooltip>
  ),
};

export const Sides: StoryObj = {
  render: () => (
    <Group gap="lg" style={{ padding: '4rem' }}>
      {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
        <Tooltip key={side} defaultOpen>
          <TooltipTrigger>
            <button type="button">{side}</button>
          </TooltipTrigger>
          <TooltipContent side={side}>On the {side}</TooltipContent>
        </Tooltip>
      ))}
    </Group>
  ),
};

export const NoOpenDelay: StoryObj = {
  render: () => (
    <Tooltip delay={0}>
      <TooltipTrigger>
        <button type="button">Instant on hover</button>
      </TooltipTrigger>
      <TooltipContent>No wait before showing</TooltipContent>
    </Tooltip>
  ),
};

export const OnAnIconButton: StoryObj = {
  render: () => (
    <Tooltip>
      <TooltipTrigger>
        <button
          type="button"
          aria-label="Help"
          style={{ width: 32, height: 32 }}
        >
          ?
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        The trigger can be any focusable element, not just a text button
      </TooltipContent>
    </Tooltip>
  ),
};
