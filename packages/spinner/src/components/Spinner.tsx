import type { ComponentPropsWithoutRef } from 'react';

export type SpinnerSize = 'sm' | 'md' | 'lg';

export type SpinnerProps = ComponentPropsWithoutRef<'span'> & {
  /** Accessible name announced by assistive tech. */
  label?: string;
  size?: SpinnerSize;
};

// RED stub — block 1 implementation not written yet.
export function Spinner(_props: SpinnerProps) {
  return null;
}
