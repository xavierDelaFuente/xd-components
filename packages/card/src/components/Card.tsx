import { Image, type ImageProps } from '@asnewyla/image';
import { forwardRef } from 'react';

export type CardPadding = 'sm' | 'md' | 'lg';
export type CardRadius = 'sm' | 'md' | 'lg' | 'full';

export type CardProps = {
  children: React.ReactNode;
  image?: Omit<ImageProps, 'radius'>;
  padding?: CardPadding;
  radius?: CardRadius;
};

function CardInner(
  { children, padding = 'md', radius, image }: CardProps,
  ref: React.Ref<HTMLDivElement>,
) {
  return (
    <div ref={ref} data-padding={padding} data-radius={radius}>
      {image && <Image {...image} />}
      {children}
    </div>
  );
}

export const Card = forwardRef<HTMLDivElement, CardProps>(CardInner);
