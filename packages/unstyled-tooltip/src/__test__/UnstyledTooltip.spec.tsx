import { act, fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Tooltip, TooltipContent, TooltipTrigger } from '../components';
import { queryTooltip } from '../test-utils';

describe('UnstyledTooltip — content rendering', () => {
  it('renders nothing while closed', () => {
    render(
      <Tooltip>
        <TooltipContent>Saves your work automatically</TooltipContent>
      </Tooltip>,
    );
    expect(queryTooltip()).toBeNull();
  });

  it('renders an element with role="tooltip" when defaultOpen is set', () => {
    render(
      <Tooltip defaultOpen>
        <TooltipContent>Saves your work automatically</TooltipContent>
      </Tooltip>,
    );
    expect(queryTooltip()).toBeInTheDocument();
  });

  it('renders the content text when open', () => {
    render(
      <Tooltip defaultOpen>
        <TooltipContent>Saves your work automatically</TooltipContent>
      </Tooltip>,
    );
    expect(queryTooltip()).toHaveTextContent('Saves your work automatically');
  });

  it('gives the tooltip content an id', () => {
    render(
      <Tooltip defaultOpen>
        <TooltipContent>Saves your work automatically</TooltipContent>
      </Tooltip>,
    );
    expect(queryTooltip()).toHaveAttribute('id');
  });

  it('renders when controlled open is true', () => {
    render(
      <Tooltip open>
        <TooltipContent>Saves your work automatically</TooltipContent>
      </Tooltip>,
    );
    expect(queryTooltip()).toBeInTheDocument();
  });

  it('does not render when controlled open is false, even with defaultOpen', () => {
    render(
      <Tooltip open={false} defaultOpen>
        <TooltipContent>Saves your work automatically</TooltipContent>
      </Tooltip>,
    );
    expect(queryTooltip()).toBeNull();
  });

  it('defaults data-side to "top"', () => {
    render(
      <Tooltip defaultOpen>
        <TooltipContent>Saves your work automatically</TooltipContent>
      </Tooltip>,
    );
    expect(queryTooltip()).toHaveAttribute('data-side', 'top');
  });

  it('respects an explicit side prop', () => {
    render(
      <Tooltip defaultOpen>
        <TooltipContent side="right">
          Saves your work automatically
        </TooltipContent>
      </Tooltip>,
    );
    expect(queryTooltip()).toHaveAttribute('data-side', 'right');
  });

  it('merges a custom className onto the content', () => {
    render(
      <Tooltip defaultOpen>
        <TooltipContent className="wide">Saves your work</TooltipContent>
      </Tooltip>,
    );
    expect(queryTooltip()).toHaveClass('wide');
  });

  it('passes through native div attributes on the content', () => {
    render(
      <Tooltip defaultOpen>
        <TooltipContent data-testid="tip">Saves your work</TooltipContent>
      </Tooltip>,
    );
    expect(queryTooltip()).toHaveAttribute('data-testid', 'tip');
  });

  it('forwards a ref to the content element', () => {
    const ref = createRef<HTMLSpanElement>();
    render(
      <Tooltip defaultOpen>
        <TooltipContent ref={ref}>Saves your work</TooltipContent>
      </Tooltip>,
    );
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it('throws when TooltipContent is rendered outside <Tooltip>', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() =>
      render(<TooltipContent>Saves your work</TooltipContent>),
    ).toThrow(/must be rendered inside <Tooltip>/);
    spy.mockRestore();
  });
});

describe('UnstyledTooltip — trigger interaction', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  function renderTooltip(
    props: Partial<React.ComponentProps<typeof Tooltip>> = {},
  ) {
    return render(
      <Tooltip {...props}>
        <TooltipTrigger>
          <button type="button">Save</button>
        </TooltipTrigger>
        <TooltipContent>Saves your work automatically</TooltipContent>
      </Tooltip>,
    );
  }

  it('renders the trigger child directly, without a wrapper element', () => {
    renderTooltip();
    const trigger = screen.getByRole('button', { name: 'Save' });
    expect(trigger.tagName).toBe('BUTTON');
  });

  it('opens immediately on focus, with no delay', () => {
    renderTooltip({ delay: 700 });
    fireEvent.focus(screen.getByRole('button', { name: 'Save' }));
    expect(queryTooltip()).toBeInTheDocument();
  });

  it('closes on blur', () => {
    renderTooltip();
    const trigger = screen.getByRole('button', { name: 'Save' });
    fireEvent.focus(trigger);
    fireEvent.blur(trigger);
    expect(queryTooltip()).toBeNull();
  });

  it('opens on pointer enter only after the delay elapses', () => {
    renderTooltip({ delay: 700 });
    fireEvent.pointerEnter(screen.getByRole('button', { name: 'Save' }));
    expect(queryTooltip()).toBeNull();
    act(() => {
      vi.advanceTimersByTime(700);
    });
    expect(queryTooltip()).toBeInTheDocument();
  });

  it('cancels the pending open when the pointer leaves before the delay elapses', () => {
    renderTooltip({ delay: 700 });
    const trigger = screen.getByRole('button', { name: 'Save' });
    fireEvent.pointerEnter(trigger);
    act(() => {
      vi.advanceTimersByTime(300);
    });
    fireEvent.pointerLeave(trigger);
    act(() => {
      vi.advanceTimersByTime(700);
    });
    expect(queryTooltip()).toBeNull();
  });

  it('closes on pointer leave', () => {
    renderTooltip({ delay: 0 });
    const trigger = screen.getByRole('button', { name: 'Save' });
    fireEvent.pointerEnter(trigger);
    act(() => {
      vi.advanceTimersByTime(0);
    });
    expect(queryTooltip()).toBeInTheDocument();
    fireEvent.pointerLeave(trigger);
    expect(queryTooltip()).toBeNull();
  });

  it('points aria-describedby at the content id while open', () => {
    renderTooltip();
    const trigger = screen.getByRole('button', { name: 'Save' });
    fireEvent.focus(trigger);
    const tip = queryTooltip();
    expect(trigger).toHaveAttribute('aria-describedby', tip?.id);
  });

  it('does not set aria-describedby while closed', () => {
    renderTooltip();
    expect(screen.getByRole('button', { name: 'Save' })).not.toHaveAttribute(
      'aria-describedby',
    );
  });

  it("composes the child's own onFocus handler", () => {
    const onFocus = vi.fn();
    render(
      <Tooltip>
        <TooltipTrigger>
          <button type="button" onFocus={onFocus}>
            Save
          </button>
        </TooltipTrigger>
        <TooltipContent>Saves your work</TooltipContent>
      </Tooltip>,
    );
    fireEvent.focus(screen.getByRole('button', { name: 'Save' }));
    expect(onFocus).toHaveBeenCalledTimes(1);
  });

  it('merges a ref onto the trigger child', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Tooltip>
        <TooltipTrigger>
          <button type="button" ref={ref}>
            Save
          </button>
        </TooltipTrigger>
        <TooltipContent>Saves your work</TooltipContent>
      </Tooltip>,
    );
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('calls onOpenChange when opened and closed', () => {
    const onOpenChange = vi.fn();
    renderTooltip({ onOpenChange });
    const trigger = screen.getByRole('button', { name: 'Save' });
    fireEvent.focus(trigger);
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    fireEvent.blur(trigger);
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it('throws when TooltipTrigger has more than one child', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() =>
      render(
        <Tooltip>
          <TooltipTrigger>
            <button type="button">A</button>
            <button type="button">B</button>
          </TooltipTrigger>
          <TooltipContent>x</TooltipContent>
        </Tooltip>,
      ),
    ).toThrow();
    spy.mockRestore();
  });

  it('throws when TooltipTrigger is rendered outside <Tooltip>', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() =>
      render(
        <TooltipTrigger>
          <button type="button">Save</button>
        </TooltipTrigger>,
      ),
    ).toThrow(/must be rendered inside <Tooltip>/);
    spy.mockRestore();
  });
});

describe('UnstyledTooltip — dismissal', () => {
  function renderOpen(
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

  it('closes when Escape is pressed', () => {
    renderOpen();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(queryTooltip()).toBeNull();
  });

  it('calls onOpenChange(false) on Escape', () => {
    const onOpenChange = vi.fn();
    renderOpen({ onOpenChange });
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('does not act on other keys', () => {
    renderOpen();
    fireEvent.keyDown(document, { key: 'a' });
    expect(queryTooltip()).toBeInTheDocument();
  });

  it('closes when the trigger is pressed', () => {
    renderOpen();
    fireEvent.pointerDown(screen.getByRole('button', { name: 'Save' }));
    expect(queryTooltip()).toBeNull();
  });

  it('removes the document key listener on unmount', () => {
    const removeSpy = vi.spyOn(document, 'removeEventListener');
    const { unmount } = renderOpen();
    unmount();
    expect(removeSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    removeSpy.mockRestore();
  });
});
