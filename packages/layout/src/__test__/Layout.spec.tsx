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

  it('respects an explicit direction prop', () => {
    render(
      <Layout data-testid="layout" direction="horizontal">
        content
      </Layout>,
    );
    expect(screen.getByTestId('layout')).toHaveAttribute(
      'data-direction',
      'horizontal',
    );
  });

  it('sets data-gap when gap is provided', () => {
    render(
      <Layout data-testid="layout" gap="md">
        content
      </Layout>,
    );
    expect(screen.getByTestId('layout')).toHaveAttribute('data-gap', 'md');
  });

  it('omits data-gap when gap is not provided', () => {
    render(<Layout data-testid="layout">content</Layout>);
    expect(screen.getByTestId('layout')).not.toHaveAttribute('data-gap');
  });

  it('sets data-align when align is provided', () => {
    render(
      <Layout data-testid="layout" align="center">
        content
      </Layout>,
    );
    expect(screen.getByTestId('layout')).toHaveAttribute(
      'data-align',
      'center',
    );
  });

  it('sets data-justify when justify is provided', () => {
    render(
      <Layout data-testid="layout" justify="between">
        content
      </Layout>,
    );
    expect(screen.getByTestId('layout')).toHaveAttribute(
      'data-justify',
      'between',
    );
  });

  it('sets data-wrap="true" when wrap is true', () => {
    render(
      <Layout data-testid="layout" wrap>
        content
      </Layout>,
    );
    expect(screen.getByTestId('layout')).toHaveAttribute('data-wrap', 'true');
  });

  it('omits data-wrap when wrap is false or not provided', () => {
    render(<Layout data-testid="layout">content</Layout>);
    expect(screen.getByTestId('layout')).not.toHaveAttribute('data-wrap');
  });

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
