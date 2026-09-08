import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Skeleton } from '../components';

describe('Skeleton — rendering + accessibility', () => {
  it('renders an element carrying the xd-skeleton class', () => {
    const { container } = render(<Skeleton />);
    expect(container.querySelector('.xd-skeleton')).toBeInTheDocument();
  });

  it('is hidden from assistive tech by default', () => {
    render(<Skeleton data-testid="sk" />);
    expect(screen.getByTestId('sk')).toHaveAttribute('aria-hidden', 'true');
  });

  it('lets a consumer opt back into the accessibility tree', () => {
    // Decorative by default, but escapable — {...rest} is spread before the
    // default aria-hidden so an explicit aria-hidden={false} wins. Dedicated
    // test because this is an accepted contract, not an accident.
    render(<Skeleton data-testid="sk" aria-hidden={false} />);
    expect(screen.getByTestId('sk')).not.toHaveAttribute('aria-hidden', 'true');
  });

  it('has no data-radius by default', () => {
    render(<Skeleton data-testid="sk" />);
    expect(screen.getByTestId('sk')).not.toHaveAttribute('data-radius');
  });

  it('reflects the radius prop as data-radius', () => {
    render(<Skeleton data-testid="sk" radius="full" />);
    expect(screen.getByTestId('sk')).toHaveAttribute('data-radius', 'full');
  });

  it('applies a numeric width/height as pixels via inline style', () => {
    render(<Skeleton data-testid="sk" width={200} height={16} />);
    const sk = screen.getByTestId('sk');
    expect(sk).toHaveStyle({ width: '200px', height: '16px' });
  });

  it('passes a string width/height straight through', () => {
    render(<Skeleton data-testid="sk" width="100%" height="3rem" />);
    const sk = screen.getByTestId('sk');
    expect(sk).toHaveStyle({ width: '100%', height: '3rem' });
  });

  it('merges a consumer style with the sizing style', () => {
    render(<Skeleton data-testid="sk" width={80} style={{ marginTop: 8 }} />);
    const sk = screen.getByTestId('sk');
    expect(sk).toHaveStyle({ width: '80px', marginTop: '8px' });
  });

  it('merges a consumer className rather than replacing xd-skeleton', () => {
    render(<Skeleton data-testid="sk" className="mb-2" />);
    const sk = screen.getByTestId('sk');
    expect(sk).toHaveClass('xd-skeleton');
    expect(sk).toHaveClass('mb-2');
  });

  it('forwards a ref to the root element', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Skeleton ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it('forwards native span props to the root element', () => {
    render(<Skeleton data-testid="sk" id="row-placeholder" />);
    expect(screen.getByTestId('sk')).toHaveAttribute('id', 'row-placeholder');
  });
});
