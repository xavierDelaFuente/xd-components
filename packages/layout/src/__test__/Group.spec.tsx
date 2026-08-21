import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Group } from '../components';

describe('Group', () => {
  it('renders children inside a div', () => {
    render(
      <Group>
        <span>Item</span>
      </Group>,
    );
    expect(screen.getByText('Item')).toBeInTheDocument();
  });

  it('always sets data-direction to horizontal', () => {
    render(<Group data-testid="group">content</Group>);
    expect(screen.getByTestId('group')).toHaveAttribute(
      'data-direction',
      'horizontal',
    );
  });

  it('always renders horizontal even if a caller bypasses the type system', () => {
    render(
      // @ts-expect-error direction is not part of GroupProps — Group is always horizontal
      <Group data-testid="group" direction="vertical">
        content
      </Group>,
    );
    expect(screen.getByTestId('group')).toHaveAttribute(
      'data-direction',
      'horizontal',
    );
  });

  it.each(['sm', 'md', 'lg'] as const)(
    'forwards gap=%s to the underlying Layout',
    (gap) => {
      render(
        <Group data-testid="group" gap={gap}>
          content
        </Group>,
      );
      expect(screen.getByTestId('group')).toHaveAttribute('data-gap', gap);
    },
  );

  it.each(['start', 'center', 'end'] as const)(
    'forwards align=%s to the underlying Layout',
    (align) => {
      render(
        <Group data-testid="group" align={align}>
          content
        </Group>,
      );
      expect(screen.getByTestId('group')).toHaveAttribute('data-align', align);
    },
  );

  it.each(['start', 'center', 'end', 'between', 'around'] as const)(
    'forwards justify=%s to the underlying Layout',
    (justify) => {
      render(
        <Group data-testid="group" justify={justify}>
          content
        </Group>,
      );
      expect(screen.getByTestId('group')).toHaveAttribute(
        'data-justify',
        justify,
      );
    },
  );

  it('forwards wrap to the underlying Layout', () => {
    render(
      <Group data-testid="group" wrap>
        content
      </Group>,
    );
    expect(screen.getByTestId('group')).toHaveAttribute('data-wrap', 'true');
  });

  it('merges a custom className with the base xd-layout class', () => {
    render(
      <Group data-testid="group" className="toolbar">
        content
      </Group>,
    );
    expect(screen.getByTestId('group')).toHaveClass('xd-layout', 'toolbar');
  });

  it('forwards a ref to the underlying div', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Group ref={ref}>content</Group>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('passes through arbitrary native div attributes', () => {
    render(
      <Group data-testid="group" aria-label="Actions">
        content
      </Group>,
    );
    expect(screen.getByTestId('group')).toHaveAttribute(
      'aria-label',
      'Actions',
    );
  });
});
