import { fireEvent, render } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Video } from '../components';
import { getVideo } from '../test-utils';

describe('Video — base render', () => {
  it('renders a video element', () => {
    render(<Video src="/clip.mp4" />);
    expect(getVideo()).toBeInstanceOf(HTMLVideoElement);
  });

  it('sets src on the video element from the src prop', () => {
    render(<Video src="/clip.mp4" />);
    expect(getVideo()).toHaveAttribute('src', '/clip.mp4');
  });

  it('omits the src attribute when src is not provided', () => {
    render(<Video />);
    expect(getVideo()).not.toHaveAttribute('src');
  });

  it('applies the xd-video base class', () => {
    render(<Video src="/clip.mp4" />);
    expect(getVideo()).toHaveClass('xd-video');
  });

  it('merges a custom className with the base xd-video class', () => {
    render(<Video src="/clip.mp4" className="hero" />);
    expect(getVideo()).toHaveClass('xd-video', 'hero');
  });

  it('renders only xd-video in the class attribute when no className is passed', () => {
    render(<Video src="/clip.mp4" />);
    expect(getVideo().getAttribute('class')).toBe('xd-video');
  });

  it('defaults data-testid to "video"', () => {
    render(<Video src="/clip.mp4" />);
    expect(getVideo('video')).toBeInstanceOf(HTMLVideoElement);
  });

  it('respects an explicit data-testid', () => {
    render(<Video src="/clip.mp4" data-testid="intro-clip" />);
    expect(getVideo('intro-clip')).toBeInstanceOf(HTMLVideoElement);
  });

  it('forwards a ref to the underlying video element', () => {
    const ref = createRef<HTMLVideoElement>();
    render(<Video ref={ref} src="/clip.mp4" />);
    expect(ref.current).toBeInstanceOf(HTMLVideoElement);
  });

  it('passes through the native controls attribute', () => {
    render(<Video src="/clip.mp4" controls />);
    expect(getVideo()).toHaveAttribute('controls');
  });

  it('passes through the native loop attribute', () => {
    render(<Video src="/clip.mp4" loop />);
    expect(getVideo()).toHaveAttribute('loop');
  });

  it('passes through the native preload attribute', () => {
    render(<Video src="/clip.mp4" preload="none" />);
    expect(getVideo()).toHaveAttribute('preload', 'none');
  });

  it('renders children as native fallback content', () => {
    render(
      <Video src="/clip.mp4">
        Your browser does not support the video tag.
      </Video>,
    );
    expect(getVideo()).toHaveTextContent(
      'Your browser does not support the video tag.',
    );
  });
});

describe('Video — presentation props', () => {
  it('defaults data-fit to cover when fit is not provided', () => {
    render(<Video src="/clip.mp4" />);
    expect(getVideo()).toHaveAttribute('data-fit', 'cover');
  });

  it('respects an explicit fit prop', () => {
    render(<Video src="/clip.mp4" fit="contain" />);
    expect(getVideo()).toHaveAttribute('data-fit', 'contain');
  });

  it('omits data-radius when radius is not provided', () => {
    render(<Video src="/clip.mp4" />);
    expect(getVideo()).not.toHaveAttribute('data-radius');
  });

  it('sets data-radius when radius is provided', () => {
    render(<Video src="/clip.mp4" radius="lg" />);
    expect(getVideo()).toHaveAttribute('data-radius', 'lg');
  });

  it('applies aspectRatio to the inline style when provided', () => {
    render(<Video src="/clip.mp4" aspectRatio="16 / 9" />);
    expect(getVideo()).toHaveStyle({ aspectRatio: '16 / 9' });
  });

  it('does not set an aspect-ratio style when aspectRatio is omitted', () => {
    render(<Video src="/clip.mp4" />);
    expect(getVideo().style.aspectRatio).toBe('');
  });

  it('passes through the native poster attribute', () => {
    render(<Video src="/clip.mp4" poster="/poster.jpg" />);
    expect(getVideo()).toHaveAttribute('poster', '/poster.jpg');
  });
});

describe('Video — load-error fallback', () => {
  it('swaps to the fallback src when the video fails to load', () => {
    render(<Video src="/broken.mp4" fallback="/placeholder.mp4" />);
    const video = getVideo();
    fireEvent.error(video);
    expect(video).toHaveAttribute('src', '/placeholder.mp4');
  });

  it('still swaps to the fallback even when the consumer passes their own onError', () => {
    const handleError = vi.fn();
    render(
      <Video
        src="/broken.mp4"
        fallback="/placeholder.mp4"
        onError={handleError}
      />,
    );
    const video = getVideo();
    fireEvent.error(video);
    expect(handleError).toHaveBeenCalled();
    expect(video).toHaveAttribute('src', '/placeholder.mp4');
  });

  it('leaves src unchanged on error when no fallback is provided', () => {
    render(<Video src="/broken.mp4" />);
    const video = getVideo();
    fireEvent.error(video);
    expect(video).toHaveAttribute('src', '/broken.mp4');
  });

  it('retries the original src (not the stale fallback) when src changes after an error', () => {
    const { rerender } = render(
      <Video src="/broken.mp4" fallback="/placeholder.mp4" />,
    );
    const video = getVideo();
    fireEvent.error(video);
    expect(video).toHaveAttribute('src', '/placeholder.mp4');

    rerender(<Video src="/new-clip.mp4" fallback="/placeholder.mp4" />);
    expect(getVideo()).toHaveAttribute('src', '/new-clip.mp4');
  });
});
