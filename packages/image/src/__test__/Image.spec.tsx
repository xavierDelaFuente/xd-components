import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Image } from '../components';

describe('Image', () => {
  it('renders an img with the given src and alt', () => {
    render(<Image src="/photo.jpg" alt="A mountain at sunset" />);
    const img = screen.getByAltText('A mountain at sunset');
    expect(img).toHaveAttribute('src', '/photo.jpg');
  });

  it('defaults data-fit to cover when fit is not provided', () => {
    render(<Image src="/photo.jpg" alt="desc" />);
    expect(screen.getByAltText('desc')).toHaveAttribute('data-fit', 'cover');
  });

  it('respects an explicit fit prop', () => {
    render(<Image src="/photo.jpg" alt="desc" fit="contain" />);
    expect(screen.getByAltText('desc')).toHaveAttribute('data-fit', 'contain');
  });

  it('omits data-radius when radius is not provided', () => {
    render(<Image src="/photo.jpg" alt="desc" />);
    expect(screen.getByAltText('desc')).not.toHaveAttribute('data-radius');
  });

  it('sets data-radius when radius is provided', () => {
    render(<Image src="/photo.jpg" alt="desc" radius="lg" />);
    expect(screen.getByAltText('desc')).toHaveAttribute('data-radius', 'lg');
  });

  it('applies aspectRatio to the inline style when provided', () => {
    render(<Image src="/photo.jpg" alt="desc" aspectRatio="16 / 9" />);
    expect(screen.getByAltText('desc')).toHaveStyle({ aspectRatio: '16 / 9' });
  });

  it('does not set an aspect-ratio style when aspectRatio is omitted', () => {
    render(<Image src="/photo.jpg" alt="desc" />);
    expect(screen.getByAltText('desc').style.aspectRatio).toBe('');
  });

  it('swaps to the fallback src when the image fails to load', () => {
    render(<Image src="/broken.jpg" alt="desc" fallback="/placeholder.jpg" />);
    const img = screen.getByAltText('desc');
    fireEvent.error(img);
    expect(img).toHaveAttribute('src', '/placeholder.jpg');
  });

  it('leaves src unchanged on error when no fallback is provided', () => {
    render(<Image src="/broken.jpg" alt="desc" />);
    const img = screen.getByAltText('desc');
    fireEvent.error(img);
    expect(img).toHaveAttribute('src', '/broken.jpg');
  });

  it('retries the original src (not the stale fallback) when src changes after an error', () => {
    const { rerender } = render(
      <Image src="/broken.jpg" alt="desc" fallback="/placeholder.jpg" />,
    );
    const img = screen.getByAltText('desc');
    fireEvent.error(img);
    expect(img).toHaveAttribute('src', '/placeholder.jpg');

    rerender(
      <Image src="/new-photo.jpg" alt="desc" fallback="/placeholder.jpg" />,
    );
    expect(screen.getByAltText('desc')).toHaveAttribute(
      'src',
      '/new-photo.jpg',
    );
  });

  it('forwards a ref to the underlying img element', () => {
    const ref = createRef<HTMLImageElement>();
    render(<Image ref={ref} src="/photo.jpg" alt="desc" />);
    expect(ref.current).toBeInstanceOf(HTMLImageElement);
  });

  it('merges a custom className with the base xd-image class', () => {
    render(<Image src="/photo.jpg" alt="desc" className="hero" />);
    expect(screen.getByAltText('desc')).toHaveClass('xd-image', 'hero');
  });

  it('passes through arbitrary native img attributes', () => {
    render(<Image src="/photo.jpg" alt="desc" loading="lazy" />);
    expect(screen.getByAltText('desc')).toHaveAttribute('loading', 'lazy');
  });
});
