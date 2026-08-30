import { Button } from '@asnewyla/button';
import { IconButton } from '@asnewyla/icon-button';
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
        <Button>Hover or focus me</Button>
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
            <Button>{side}</Button>
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
        <Button>Instant on hover</Button>
      </TooltipTrigger>
      <TooltipContent>No wait before showing</TooltipContent>
    </Tooltip>
  ),
};

export const OnAnIconButton: StoryObj = {
  render: () => (
    <Tooltip>
      <TooltipTrigger>
        <IconButton label="Help" icon={<span aria-hidden="true">?</span>} />
      </TooltipTrigger>
      <TooltipContent side="bottom">
        The trigger can be any focusable element, not just a text button
      </TooltipContent>
    </Tooltip>
  ),
};
