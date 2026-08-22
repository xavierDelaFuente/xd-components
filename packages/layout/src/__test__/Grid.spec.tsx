import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Grid } from '../components';

describe('Grid', () => {
  it('renders children inside a div', () => {
    render(
      <Grid>
        <span>Item</span>
      </Grid>,
    );
    expect(screen.getByText('Item')).toBeInTheDocument();
  });

  it('sets grid-template-columns to repeat(N, 1fr) when columns is a number', () => {
    render(
      <Grid data-testid="grid" columns={3}>
        content
      </Grid>,
    );
    expect(screen.getByTestId('grid')).toHaveStyle({
      gridTemplateColumns: 'repeat(3, 1fr)',
    });
  });

  it('passes a string columns value straight through as grid-template-columns', () => {
    render(
      <Grid data-testid="grid" columns="200px 1fr 200px">
        content
      </Grid>,
    );
    expect(screen.getByTestId('grid')).toHaveStyle({
      gridTemplateColumns: '200px 1fr 200px',
    });
  });

  it('sets no grid-template-columns style when columns is not provided', () => {
    render(<Grid data-testid="grid">content</Grid>);
    expect(screen.getByTestId('grid').style.gridTemplateColumns).toBe('');
  });

  it.each(['sm', 'md', 'lg'] as const)('sets data-gap to %s', (gap) => {
    render(
      <Grid data-testid="grid" gap={gap}>
        content
      </Grid>,
    );
    expect(screen.getByTestId('grid')).toHaveAttribute('data-gap', gap);
  });

  it('omits data-gap when gap is not provided', () => {
    render(<Grid data-testid="grid">content</Grid>);
    expect(screen.getByTestId('grid')).not.toHaveAttribute('data-gap');
  });

  it.each(['start', 'center', 'end'] as const)(
    'sets data-align to %s',
    (align) => {
      render(
        <Grid data-testid="grid" align={align}>
          content
        </Grid>,
      );
      expect(screen.getByTestId('grid')).toHaveAttribute('data-align', align);
    },
  );

  it('omits data-align when align is not provided', () => {
    render(<Grid data-testid="grid">content</Grid>);
    expect(screen.getByTestId('grid')).not.toHaveAttribute('data-align');
  });

  it.each(['start', 'center', 'end'] as const)(
    'sets data-justify to %s',
    (justify) => {
      render(
        <Grid data-testid="grid" justify={justify}>
          content
        </Grid>,
      );
      expect(screen.getByTestId('grid')).toHaveAttribute(
        'data-justify',
        justify,
      );
    },
  );

  it('omits data-justify when justify is not provided', () => {
    render(<Grid data-testid="grid">content</Grid>);
    expect(screen.getByTestId('grid')).not.toHaveAttribute('data-justify');
  });

  it('merges a custom className with the base xd-grid class', () => {
    render(
      <Grid data-testid="grid" className="dashboard">
        content
      </Grid>,
    );
    expect(screen.getByTestId('grid')).toHaveClass('xd-grid', 'dashboard');
  });

  it('forwards a ref to the underlying div', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Grid ref={ref}>content</Grid>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('passes through arbitrary native div attributes', () => {
    render(
      <Grid data-testid="grid" aria-label="Product grid">
        content
      </Grid>,
    );
    expect(screen.getByTestId('grid')).toHaveAttribute(
      'aria-label',
      'Product grid',
    );
  });

  it('preserves a consumer-provided style alongside the columns-derived one', () => {
    render(
      <Grid data-testid="grid" columns={2} style={{ minHeight: 200 }}>
        content
      </Grid>,
    );
    const grid = screen.getByTestId('grid');
    expect(grid).toHaveStyle({
      gridTemplateColumns: 'repeat(2, 1fr)',
      minHeight: '200px',
    });
  });
});
