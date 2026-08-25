import { act } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UnstyledButton } from '../components/UnstyledButton';
import {
  clickButton,
  getButton,
  getInner,
  hoverButton,
  unhoverButton,
} from '../test-utils';

function CustomComponent({
  children,
  ...props
}: {
  children: React.ReactNode;
}) {
  return <div {...props}>{children}</div>;
}

let user: UserEvent;

beforeEach(() => {
  user = userEvent.setup();
});

describe('UnstyledButton', () => {
  it('renders as a <button> element by default', () => {
    render(<UnstyledButton>Press me</UnstyledButton>);

    const button = getButton(/press me/i);
    expect(button).toBeInTheDocument();
    expect(button.tagName).toBe('BUTTON');
  });

  it('renders as a custom HTML element when "as" prop is provided', () => {
    render(
      <UnstyledButton as="a" href="/home">
        Go home
      </UnstyledButton>,
    );

    const link = screen.getByRole('link', { name: /go home/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/home');
  });

  it('renders as a custom Component when "as" prop is provided', () => {
    render(
      <UnstyledButton as={() => <CustomComponent>Go home</CustomComponent>}>
        Go home
      </UnstyledButton>,
    );

    const customComponent = screen.getByText('Go home');
    expect(customComponent).toBeInTheDocument();
  });

  it('forwards ref to the underlying DOM element', () => {
    const ref = { current: null } as React.RefObject<HTMLButtonElement>;
    render(<UnstyledButton ref={ref}>Ref test</UnstyledButton>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('accepts children as a render function', () => {
    render(
      <UnstyledButton>
        {({ isHovered }) => (
          <span data-testid="inner">{isHovered ? 'hovered' : 'idle'}</span>
        )}
      </UnstyledButton>,
    );

    expect(getInner()).toHaveTextContent('idle');
  });

  it('passes isHovered=true to render function on hover', async () => {
    render(
      <UnstyledButton>
        {({ isHovered }) => (
          <span data-testid="inner">{isHovered ? 'hovered' : 'idle'}</span>
        )}
      </UnstyledButton>,
    );

    await hoverButton(user);
    expect(getInner()).toHaveTextContent('hovered');
  });

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    render(<UnstyledButton onClick={handleClick}>Click</UnstyledButton>);
    await clickButton(user);
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('does not call onClick when disabled', async () => {
    const handleClick = vi.fn();
    render(
      <UnstyledButton disabled onClick={handleClick}>
        Disabled
      </UnstyledButton>,
    );
    await clickButton(user);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('is focusable via Tab key', async () => {
    render(<UnstyledButton>Focus me</UnstyledButton>);
    await user.tab();
    expect(getButton()).toHaveFocus();
  });

  it('triggers on Enter and Space keys', async () => {
    const handleClick = vi.fn();
    render(<UnstyledButton onClick={handleClick}>Key</UnstyledButton>);
    const button = getButton();

    act(() => {
      button.focus();
    });
    await user.keyboard('{Enter}');
    await user.keyboard(' ');

    expect(handleClick).toHaveBeenCalledTimes(2);
  });

  it('sets data-disabled when disabled', () => {
    render(<UnstyledButton disabled>Disabled</UnstyledButton>);
    expect(getButton()).toHaveAttribute('data-disabled', 'true');
  });

  it('still tracks isHovered when the consumer passes their own onMouseEnter/onMouseLeave', async () => {
    const handleMouseEnter = vi.fn();
    const handleMouseLeave = vi.fn();
    render(
      <UnstyledButton
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {({ isHovered }) => (
          <span data-testid="inner">{isHovered ? 'hovered' : 'idle'}</span>
        )}
      </UnstyledButton>,
    );

    await hoverButton(user);
    expect(handleMouseEnter).toHaveBeenCalled();
    expect(getInner()).toHaveTextContent('hovered');

    await unhoverButton(user);
    expect(handleMouseLeave).toHaveBeenCalled();
    expect(getInner()).toHaveTextContent('idle');
  });

  it('still tracks isPressed when the consumer passes their own onMouseDown/onMouseUp', () => {
    const handleMouseDown = vi.fn();
    const handleMouseUp = vi.fn();
    render(
      <UnstyledButton onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
        {({ isPressed }) => (
          <span data-testid="inner">{isPressed ? 'pressed' : 'idle'}</span>
        )}
      </UnstyledButton>,
    );
    const button = getButton();

    fireEvent.mouseDown(button);
    expect(handleMouseDown).toHaveBeenCalled();
    expect(getInner()).toHaveTextContent('pressed');

    fireEvent.mouseUp(button);
    expect(handleMouseUp).toHaveBeenCalled();
    expect(getInner()).toHaveTextContent('idle');
  });

  it('still tracks data-focused when the consumer passes their own onFocus/onBlur', () => {
    const handleFocus = vi.fn();
    const handleBlur = vi.fn();
    render(
      <UnstyledButton onFocus={handleFocus} onBlur={handleBlur}>
        Focus me
      </UnstyledButton>,
    );
    const button = getButton();

    fireEvent.focus(button);
    expect(handleFocus).toHaveBeenCalled();
    expect(button).toHaveAttribute('data-focused', 'true');

    fireEvent.blur(button);
    expect(handleBlur).toHaveBeenCalled();
    expect(button).not.toHaveAttribute('data-focused');
  });
});
