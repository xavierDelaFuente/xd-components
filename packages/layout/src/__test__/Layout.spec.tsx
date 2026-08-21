import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Layout } from '../components';

describe('Layout', () => {
  it('renders children inside a div', () => {
    render(
      <Layout>
        <span>Item</span>
      </Layout>,
    );
    expect(screen.getByText('Item')).toBeInTheDocument();
  });

  it('defaults data-direction to vertical', () => {
    render(<Layout data-testid="layout">content</Layout>);
    expect(screen.getByTestId('layout')).toHaveAttribute(
      'data-direction',
      'vertical',
    );
  });

  it.each(['horizontal', 'vertical'] as const)(
    'sets data-direction to %s',
    (direction) => {
      render(
        <Layout data-testid="layout" direction={direction}>
          content
        </Layout>,
      );
      expect(screen.getByTestId('layout')).toHaveAttribute(
        'data-direction',
        direction,
      );
    },
  );

  it.each(['sm', 'md', 'lg'] as const)('sets data-gap to %s', (gap) => {
    render(
      <Layout data-testid="layout" gap={gap}>
        content
      </Layout>,
    );
    expect(screen.getByTestId('layout')).toHaveAttribute('data-gap', gap);
  });

  it('omits data-gap when gap is not provided', () => {
    render(<Layout data-testid="layout">content</Layout>);
    expect(screen.getByTestId('layout')).not.toHaveAttribute('data-gap');
  });

  it.each(['start', 'center', 'end'] as const)(
    'sets data-align to %s',
    (align) => {
      render(
        <Layout data-testid="layout" align={align}>
          content
        </Layout>,
      );
      expect(screen.getByTestId('layout')).toHaveAttribute('data-align', align);
    },
  );

  it('omits data-align when align is not provided', () => {
    render(<Layout data-testid="layout">content</Layout>);
    expect(screen.getByTestId('layout')).not.toHaveAttribute('data-align');
  });

  it.each(['start', 'center', 'end', 'between', 'around'] as const)(
    'sets data-justify to %s',
    (justify) => {
      render(
        <Layout data-testid="layout" justify={justify}>
          content
        </Layout>,
      );
      expect(screen.getByTestId('layout')).toHaveAttribute(
        'data-justify',
        justify,
      );
    },
  );

  it('omits data-justify when justify is not provided', () => {
    render(<Layout data-testid="layout">content</Layout>);
    expect(screen.getByTestId('layout')).not.toHaveAttribute('data-justify');
  });

  it.each([true, 'wrap'] as const)(
    'sets data-wrap="true" when wrap is %s',
    (wrap) => {
      render(
        <Layout data-testid="layout" wrap={wrap}>
          content
        </Layout>,
      );
      expect(screen.getByTestId('layout')).toHaveAttribute('data-wrap', 'true');
    },
  );

  it.each([false, undefined, 'nowrap'] as const)(
    'omits data-wrap when wrap is %s',
    (wrap) => {
      render(
        <Layout data-testid="layout" wrap={wrap}>
          content
        </Layout>,
      );
      expect(screen.getByTestId('layout')).not.toHaveAttribute('data-wrap');
    },
  );

  it('merges a custom className with the base xd-layout class', () => {
    render(
      <Layout data-testid="layout" className="hero">
        content
      </Layout>,
    );
    expect(screen.getByTestId('layout')).toHaveClass('xd-layout', 'hero');
  });

  it('forwards a ref to the underlying div', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Layout ref={ref}>content</Layout>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('passes through arbitrary native div attributes', () => {
    render(
      <Layout data-testid="layout" aria-label="Page section">
        content
      </Layout>,
    );
    expect(screen.getByTestId('layout')).toHaveAttribute(
      'aria-label',
      'Page section',
    );
  });
});
