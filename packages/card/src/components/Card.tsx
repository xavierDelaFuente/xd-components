import { Image, type ImageProps } from '@asnewyla/image';
import {
  type ComponentPropsWithoutRef,
  type ForwardedRef,
  type ReactNode,
  forwardRef,
} from 'react';
import './Card.css';

export type CardPadding = 'sm' | 'md' | 'lg';
export type CardRadius = 'sm' | 'md' | 'lg' | 'full';

export type CardProps = ComponentPropsWithoutRef<'div'> & {
  children: ReactNode;
  image?: Omit<ImageProps, 'radius'>;
  padding?: CardPadding;
  radius?: CardRadius;
};

function CardInner(
  {
    children,
    image,
    padding = 'md',
    radius,
    className,
    ...restProps
  }: CardProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <div
      ref={ref}
      {...restProps}
      className={['xd-card', className].filter(Boolean).join(' ')}
      data-padding={padding}
      data-radius={radius}
    >
      {image && <Image {...image} />}
      {children}
    </div>
  );
}

export const Card = forwardRef<HTMLDivElement, CardProps>(CardInner);
