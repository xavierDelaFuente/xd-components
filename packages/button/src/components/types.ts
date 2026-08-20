import type { ComponentPropsWithoutRef, ElementType } from 'react';

export type OverridableProps<
  T extends ElementType,
  OwnProps = object,
> = OwnProps & Omit<ComponentPropsWithoutRef<T>, keyof OwnProps>;
