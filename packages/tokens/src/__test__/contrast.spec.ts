import { describe, expect, it } from 'vitest';
import { contrastRatio, resolvedThemes } from './contrast';

describe('contrastRatio', () => {
  it('matches the WCAG extremes and identity', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 1);
    expect(contrastRatio('#777777', '#777777')).toBe(1);
  });

  it('agrees for the same colour written as hex and oklch', () => {
    // oklch(100% 0 0) is white, oklch(0% 0 0) is black.
    expect(contrastRatio('oklch(100% 0 0)', 'oklch(0% 0 0)')).toBeCloseTo(
      21,
      1,
    );
  });
});

// Pairs the Button `outline` variant relies on: its border against the page
// (WCAG 1.4.11, 3:1) and its label at rest and on hover (WCAG 1.4.3, 4.5:1).
const OUTLINE_PAIRS = [
  ['--xd-color-border-strong', '--xd-color-surface', 3],
  ['--xd-color-text', '--xd-color-surface', 4.5],
  ['--xd-color-text', '--xd-color-surface-hover', 4.5],
] as const;

describe.each(resolvedThemes())('$theme ($mode)', ({ tokens }) => {
  it.each(OUTLINE_PAIRS)('%s on %s meets %d:1', (fg, bg, min) => {
    expect(contrastRatio(tokens[fg], tokens[bg])).toBeGreaterThanOrEqual(min);
  });
});
