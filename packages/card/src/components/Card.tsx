import { Image } from '@asnewyla/image';
import { forwardRef } from 'react';

export type CardProps = {
    children: React.ReactNode;
    padding: 'sm' | 'md' | 'lg';
    radius?: 'sm' | 'md' | 'lg';
    image?: {
        src: string;
        alt: string;
        fit?: 'cover' | 'contain';
        aspectRatio?: string;
    }
};
function CardInner({ children, padding = 'md', radius, image }: CardProps, ref: React.Ref<HTMLDivElement>) {
    return <div ref={ref} data-padding={padding} data-radius={radius}>
        {image && (
            <Image src={image.src} alt={image.alt} fit={image.fit} aspectRatio={image.aspectRatio} />
        )}
        {children}
    </div>;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(CardInner);
