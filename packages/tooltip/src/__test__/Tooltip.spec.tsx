import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Tooltip, TooltipContent, TooltipTrigger } from '../components';

function renderTooltip(
  props: Partial<React.ComponentProps<typeof Tooltip>> = {},
) {
  return render(
    <Tooltip defaultOpen {...props}>
      <TooltipTrigger>
        <button type="button">Save</button>
      </TooltipTrigger>
      <TooltipContent>Saves your work automatically</TooltipContent>
    </Tooltip>,
  );
}

describe('Tooltip (styled)', () => {
  it('applies the base xd-tooltip-root class to the wrapper', () => {
    const { container } = renderTooltip();
    expect(container.firstElementChild).toHaveClass('xd-tooltip-root');
  });

  it('merges a consumer className onto the wrapper, base class first', () => {
    const { container } = renderTooltip({ className: 'inline-help' });
    expect(container.firstElementChild).toHaveClass(
      'xd-tooltip-root',
      'inline-help',
    );
  });

  it('applies the base xd-tooltip class to the content', () => {
    renderTooltip();
    expect(screen.getByRole('tooltip')).toHaveClass('xd-tooltip');
  });

  it('merges a consumer className onto the content, base class first', () => {
    render(
      <Tooltip defaultOpen>
        <TooltipTrigger>
          <button type="button">Save</button>
        </TooltipTrigger>
        <TooltipContent className="wide">Saves your work</TooltipContent>
      </Tooltip>,
    );
    expect(screen.getByRole('tooltip')).toHaveClass('xd-tooltip', 'wide');
  });

  it('keeps the primitive data-side attribute on the content', () => {
    render(
      <Tooltip defaultOpen>
        <TooltipTrigger>
          <button type="button">Save</button>
        </TooltipTrigger>
        <TooltipContent side="right">Saves your work</TooltipContent>
      </Tooltip>,
    );
    expect(screen.getByRole('tooltip')).toHaveAttribute('data-side', 'right');
  });

  it('forwards a ref to the content element', () => {
    const ref = createRef<HTMLSpanElement>();
    render(
      <Tooltip defaultOpen>
        <TooltipTrigger>
          <button type="button">Save</button>
        </TooltipTrigger>
        <TooltipContent ref={ref}>Saves your work</TooltipContent>
      </Tooltip>,
    );
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it('still opens and closes like the primitive', () => {
    render(
      <Tooltip>
        <TooltipTrigger>
          <button type="button">Save</button>
        </TooltipTrigger>
        <TooltipContent>Saves your work</TooltipContent>
      </Tooltip>,
    );
    const trigger = screen.getByRole('button', { name: 'Save' });
    expect(screen.queryByRole('tooltip')).toBeNull();
    fireEvent.focus(trigger);
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    fireEvent.blur(trigger);
    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('wires aria-describedby from the trigger to the content', () => {
    renderTooltip();
    const trigger = screen.getByRole('button', { name: 'Save' });
    expect(trigger).toHaveAttribute(
      'aria-describedby',
      screen.getByRole('tooltip').id,
    );
  });
});
