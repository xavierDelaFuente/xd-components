import {
  type ForwardedRef,
  type ImgHTMLAttributes,
  forwardRef,
  useEffect,
  useState,
} from 'react';
import './Image.css';

export type ImageFit = 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
export type ImageRadius = 'sm' | 'md' | 'lg' | 'full';

export interface ImageProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'alt'> {
  alt: string;
  aspectRatio?: string;
  fit?: ImageFit;
  radius?: ImageRadius;
  fallback?: string;
}

function ImageInner(
  {
    alt,
    aspectRatio,
    fit = 'cover',
    radius,
    fallback,
    src,
    className,
    style,
    ...restProps
  }: ImageProps,
  ref: ForwardedRef<HTMLImageElement>,
) {
  const [hasErrored, setHasErrored] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: src triggers the reset intentionally, it isn't read in the body
  useEffect(() => {
    setHasErrored(false);
  }, [src]);

  const resolvedSrc = hasErrored && fallback ? fallback : src;

  return (
    <img
      ref={ref}
      src={resolvedSrc}
      alt={alt}
      data-fit={fit}
      data-radius={radius || undefined}
      className={['xd-image', className].filter(Boolean).join(' ')}
      style={aspectRatio !== undefined ? { aspectRatio, ...style } : style}
      onError={() => setHasErrored(true)}
      {...restProps}
    />
  );
}

export const Image = forwardRef(ImageInner);
