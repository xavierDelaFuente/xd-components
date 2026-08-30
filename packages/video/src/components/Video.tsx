import {
  type ForwardedRef,
  forwardRef,
  type ReactEventHandler,
  useEffect,
  useState,
  type VideoHTMLAttributes,
} from 'react';
import './Video.css';

export type VideoFit = 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
export type VideoRadius = 'sm' | 'md' | 'lg' | 'full';

export type VideoProps = VideoHTMLAttributes<HTMLVideoElement> & {
  'data-testid'?: string;
  aspectRatio?: string;
  fit?: VideoFit;
  radius?: VideoRadius;
  fallback?: string;
};

function VideoInner(
  {
    aspectRatio,
    fit = 'cover',
    radius,
    fallback,
    src,
    className,
    style,
    onError,
    children,
    'data-testid': testId = 'video',
    ...restProps
  }: VideoProps,
  ref: ForwardedRef<HTMLVideoElement>,
) {
  const [hasErrored, setHasErrored] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: src triggers the reset intentionally, it isn't read in the body
  useEffect(() => {
    setHasErrored(false);
  }, [src]);

  const resolvedSrc = hasErrored && fallback ? fallback : src;

  const handleError: ReactEventHandler<HTMLVideoElement> = (e) => {
    setHasErrored(true);
    onError?.(e);
  };

  return (
    <video
      {...restProps}
      ref={ref}
      src={resolvedSrc}
      data-fit={fit}
      data-radius={radius || undefined}
      data-testid={testId}
      className={className ? `xd-video ${className}` : 'xd-video'}
      style={aspectRatio !== undefined ? { aspectRatio, ...style } : style}
      onError={handleError}
    >
      {children}
    </video>
  );
}

export const Video = forwardRef(VideoInner);
