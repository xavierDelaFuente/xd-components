import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { UnstyledButton } from '../components/UnstyledButton';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { act } from 'react';

function CustomComponent({
  children,
  ...props
}: {
  children: React.ReactNode;
}) {
  return <div {...props}>{children}</div>;
}

describe('UnstyledButton', () => {
  it('renders as a <button> element by default', () => {
    render(<UnstyledButton>Press me</UnstyledButton>);

    const button = screen.getByRole('button', { name: /press me/i });
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
      <UnstyledButton as={() => <CustomComponent children="Go home" />}>
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

    const inner = screen.getByTestId('inner');
    expect(inner).toHaveTextContent('idle');
  });

  it('passes isHovered=true to render function on hover', async () => {
    const user = userEvent.setup();

    render(
      <UnstyledButton>
        {({ isHovered }) => (
          <span data-testid="inner">{isHovered ? 'hovered' : 'idle'}</span>
        )}
      </UnstyledButton>,
    );

    await user.hover(screen.getByRole('button'));
    expect(screen.getByTestId('inner')).toHaveTextContent('hovered');
  });

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    render(<UnstyledButton onClick={handleClick}>Click</UnstyledButton>);
    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('does not call onClick when disabled', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    render(
      <UnstyledButton disabled onClick={handleClick}>
        Disabled
      </UnstyledButton>,
    );
    await user.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('is focusable via Tab key', async () => {
    const user = userEvent.setup();
    render(<UnstyledButton>Focus me</UnstyledButton>);
    await user.tab();
    expect(screen.getByRole('button')).toHaveFocus();
  });

  it('triggers on Enter and Space keys', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    render(<UnstyledButton onClick={handleClick}>Key</UnstyledButton>);
    const button = screen.getByRole('button');

    act(() => {
      button.focus();
    });
    await user.keyboard('{Enter}');
    await user.keyboard(' ');

    expect(handleClick).toHaveBeenCalledTimes(2);
  });

  it('has aria-disabled when disabled', () => {
    render(<UnstyledButton disabled>Disabled</UnstyledButton>);
    expect(screen.getByRole('button')).toHaveAttribute('data-disabled', 'true');
  });

  it('sets data-disabled when disabled', () => {
    render(<UnstyledButton disabled>Disabled</UnstyledButton>);
    expect(screen.getByRole('button')).toHaveAttribute('data-disabled', 'true');
  });
});
