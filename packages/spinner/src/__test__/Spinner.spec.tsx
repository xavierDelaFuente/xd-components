import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Spinner } from '../components';

describe('Spinner — rendering + accessibility', () => {
  it('renders an element with role="status"', () => {
    render(<Spinner />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('has the accessible name "Loading" by default', () => {
    render(<Spinner />);
    expect(screen.getByRole('status')).toHaveAccessibleName('Loading');
  });

  it('uses the label prop as the accessible name', () => {
    render(<Spinner label="Saving changes" />);
    expect(screen.getByRole('status')).toHaveAccessibleName('Saving changes');
  });

  it('hides the visual indicator from assistive tech', () => {
    const { container } = render(<Spinner />);
    expect(container.querySelector('.xd-spinner-indicator')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });

  it('defaults to data-size="md"', () => {
    render(<Spinner />);
    expect(screen.getByRole('status')).toHaveAttribute('data-size', 'md');
  });

  it('reflects the size prop as data-size', () => {
    render(<Spinner size="lg" />);
    expect(screen.getByRole('status')).toHaveAttribute('data-size', 'lg');
  });

  it('merges a consumer className with xd-spinner rather than replacing it', () => {
    render(<Spinner className="mt-4" />);
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('xd-spinner');
    expect(spinner).toHaveClass('mt-4');
  });

  it('forwards a ref to the root element', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Spinner ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it('forwards native span props to the root element', () => {
    render(<Spinner id="page-loader" />);
    expect(screen.getByRole('status')).toHaveAttribute('id', 'page-loader');
  });

  it('does not let a passed role override the status role', () => {
    // {...rest} is spread before the protected attributes — a consumer cannot
    // clobber role/data-size the way Grid/Checkbox/Radio/Textarea already lock in.
    render(<Spinner role="alert" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
