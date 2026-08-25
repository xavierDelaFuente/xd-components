import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Button } from '@asnewyla/button';
import { getButton } from '@asnewyla/button/test-utils';
import { ButtonGroup } from '../index';

describe('ButtonGroup', () => {
  it('renders children inside a group role', () => {
    render(
      <ButtonGroup aria-label="Text alignment">
        <Button>Left</Button>
        <Button>Center</Button>
      </ButtonGroup>,
    );

    const group = screen.getByRole('group', { name: /text alignment/i });
    expect(getButton(/left/i)).toBeInTheDocument();
    expect(group).toContainElement(getButton(/left/i));
    expect(group).toContainElement(getButton(/center/i));
  });

  it('propagates variant to child buttons via context', () => {
    render(
      <ButtonGroup variant="secondary">
        <Button>Left</Button>
      </ButtonGroup>,
    );
    expect(getButton()).toHaveAttribute('data-variant', 'secondary');
  });

  it('propagates size to child buttons via context', () => {
    render(
      <ButtonGroup size="lg">
        <Button>Left</Button>
      </ButtonGroup>,
    );
    expect(getButton()).toHaveAttribute('data-size', 'lg');
  });

  it('propagates disabled to child buttons via context', () => {
    render(
      <ButtonGroup disabled>
        <Button>Left</Button>
      </ButtonGroup>,
    );
    expect(getButton()).toBeDisabled();
  });

  it('lets an individual button override the group variant', () => {
    render(
      <ButtonGroup variant="secondary">
        <Button>Keep</Button>
        <Button variant="destructive">Delete</Button>
      </ButtonGroup>,
    );
    expect(getButton(/keep/i)).toHaveAttribute('data-variant', 'secondary');
    expect(getButton(/delete/i)).toHaveAttribute('data-variant', 'destructive');
  });

  it('lets an individual button override the group size', () => {
    render(
      <ButtonGroup size="lg">
        <Button size="sm">Small override</Button>
      </ButtonGroup>,
    );
    expect(getButton()).toHaveAttribute('data-size', 'sm');
  });

  it('lets an individual button override the group disabled state', () => {
    render(
      <ButtonGroup disabled>
        <Button disabled={false}>Still enabled</Button>
      </ButtonGroup>,
    );
    expect(getButton()).not.toBeDisabled();
  });

  it('forwards ref to the underlying div element', () => {
    const ref = { current: null } as React.RefObject<HTMLDivElement>;
    render(
      <ButtonGroup ref={ref}>
        <Button>Left</Button>
      </ButtonGroup>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
