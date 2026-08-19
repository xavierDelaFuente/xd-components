import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { UnstyledButton } from '../components/UnstyledButton';

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
});
