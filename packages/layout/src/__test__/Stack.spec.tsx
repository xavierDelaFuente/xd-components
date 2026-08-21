import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Stack } from '../components';

describe('Stack', () => {
  it('renders children inside a div', () => {
    render(
      <Stack>
        <span>Item</span>
      </Stack>,
    );
    expect(screen.getByText('Item')).toBeInTheDocument();
  });

  it('always sets data-direction to vertical', () => {
    render(<Stack data-testid="stack">content</Stack>);
    expect(screen.getByTestId('stack')).toHaveAttribute(
      'data-direction',
      'vertical',
    );
  });

  it('always renders vertical even if a caller bypasses the type system', () => {
    render(
      // @ts-expect-error direction is not part of StackProps — Stack is always vertical
      <Stack data-testid="stack" direction="horizontal">
        content
      </Stack>,
    );
    expect(screen.getByTestId('stack')).toHaveAttribute(
      'data-direction',
      'vertical',
    );
  });

  it.each(['sm', 'md', 'lg'] as const)(
    'forwards gap=%s to the underlying Layout',
    (gap) => {
      render(
        <Stack data-testid="stack" gap={gap}>
          content
        </Stack>,
      );
      expect(screen.getByTestId('stack')).toHaveAttribute('data-gap', gap);
    },
  );

  it.each(['start', 'center', 'end'] as const)(
    'forwards align=%s to the underlying Layout',
    (align) => {
      render(
        <Stack data-testid="stack" align={align}>
          content
        </Stack>,
      );
      expect(screen.getByTestId('stack')).toHaveAttribute('data-align', align);
    },
  );

  it.each(['start', 'center', 'end', 'between', 'around'] as const)(
    'forwards justify=%s to the underlying Layout',
    (justify) => {
      render(
        <Stack data-testid="stack" justify={justify}>
          content
        </Stack>,
      );
      expect(screen.getByTestId('stack')).toHaveAttribute(
        'data-justify',
        justify,
      );
    },
  );

  it('forwards wrap to the underlying Layout', () => {
    render(
      <Stack data-testid="stack" wrap>
        content
      </Stack>,
    );
    expect(screen.getByTestId('stack')).toHaveAttribute('data-wrap', 'true');
  });

  it('merges a custom className with the base xd-layout class', () => {
    render(
      <Stack data-testid="stack" className="sidebar">
        content
      </Stack>,
    );
    expect(screen.getByTestId('stack')).toHaveClass('xd-layout', 'sidebar');
  });

  it('forwards a ref to the underlying div', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Stack ref={ref}>content</Stack>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('passes through arbitrary native div attributes', () => {
    render(
      <Stack data-testid="stack" aria-label="Sidebar">
        content
      </Stack>,
    );
    expect(screen.getByTestId('stack')).toHaveAttribute(
      'aria-label',
      'Sidebar',
    );
  });
});
