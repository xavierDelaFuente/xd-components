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

  it.each`
    padding
    ${'sm'}
    ${'md'}
    ${'lg'}
  `('sets data-padding to $padding', ({ padding }) => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Card ref={ref} padding={padding}>
        Content
      </Card>,
    );

    expect(ref.current).toHaveAttribute('data-padding', padding);
  });

  it('omits data-radius when radius is not provided (square corners by default)', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Card ref={ref}>Content</Card>);

    expect(ref.current).not.toHaveAttribute('data-radius');
  });

  it.each`
    radius
    ${'sm'}
    ${'md'}
    ${'lg'}
    ${'full'}
  `('sets data-radius to $radius', ({ radius }) => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Card ref={ref} radius={radius}>
        Content
      </Card>,
    );

    expect(ref.current).toHaveAttribute('data-radius', radius);
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

  it.each`
    fit
    ${'cover'}
    ${'contain'}
    ${'fill'}
    ${'none'}
    ${'scale-down'}
  `('passes image.fit=$fit through to the internal Image', ({ fit }) => {
    render(
      <Card image={{ src: '/photo.jpg', alt: 'A mountain', fit }}>
        Content
      </Card>,
    );

    expect(screen.getByAltText('A mountain')).toHaveAttribute('data-fit', fit);
  });

  it('passes image.aspectRatio through to the internal Image', () => {
    render(
      <Card
        image={{ src: '/photo.jpg', alt: 'A mountain', aspectRatio: '16 / 9' }}
      >
        Content
      </Card>,
    );

    expect(screen.getByAltText('A mountain')).toHaveStyle({
      aspectRatio: '16 / 9',
    });
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
