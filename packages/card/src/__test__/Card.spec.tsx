import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Card } from '../components';

describe('Card', () => {
  it('renders its children', () => {
    render(
      <Card>
        <h3>Title</h3>
        <p>Body text</p>
      </Card>,
    );

    expect(screen.getByRole('heading', { name: 'Title' })).toBeInTheDocument();
    expect(screen.getByText('Body text')).toBeInTheDocument();
  });

  it('forwards a ref to the root element', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Card ref={ref}>Content</Card>);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveTextContent('Content');
  });

  it('defaults data-padding to md when padding is not provided', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Card ref={ref}>Content</Card>);

    expect(ref.current).toHaveAttribute('data-padding', 'md');
  });

  it('respects an explicit padding prop', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Card ref={ref} padding="lg">
        Content
      </Card>,
    );

    expect(ref.current).toHaveAttribute('data-padding', 'lg');
  });

  it('omits data-radius when radius is not provided (square corners by default)', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Card ref={ref}>Content</Card>);

    expect(ref.current).not.toHaveAttribute('data-radius');
  });

  it('sets data-radius when radius is provided', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Card ref={ref} radius="lg">
        Content
      </Card>,
    );

    expect(ref.current).toHaveAttribute('data-radius', 'lg');
  });

  it('does not render an image when the image prop is omitted', () => {
    render(<Card>Content</Card>);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('renders an image via @asnewyla/image when the image prop is provided', () => {
    render(
      <Card image={{ src: '/photo.jpg', alt: 'A mountain at sunset' }}>
        Content
      </Card>,
    );

    const image = screen.getByAltText('A mountain at sunset');
    expect(image).toHaveAttribute('src', '/photo.jpg');
  });

  it('passes Image-specific props (fit, aspectRatio) through to the internal Image', () => {
    render(
      <Card
        image={{
          src: '/photo.jpg',
          alt: 'A mountain',
          fit: 'contain',
          aspectRatio: '16 / 9',
        }}
      >
        Content
      </Card>,
    );

    const image = screen.getByAltText('A mountain');
    expect(image).toHaveAttribute('data-fit', 'contain');
    expect(image).toHaveStyle({ aspectRatio: '16 / 9' });
  });

  it('renders the image before the children — full-bleed at the top', () => {
    render(
      <Card image={{ src: '/photo.jpg', alt: 'A mountain' }}>
        <p>Body</p>
      </Card>,
    );

    const image = screen.getByAltText('A mountain');
    const body = screen.getByText('Body');

    expect(
      image.compareDocumentPosition(body) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });
});
