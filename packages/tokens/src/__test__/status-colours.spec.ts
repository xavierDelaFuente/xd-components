import { describe, expect, it } from 'vitest';
import { colourBlocks, contrastRatio, resolvedThemes } from './contrast';

// Status tones for messages (Alert) and, later, badges. Each tone has:
//   --xd-color-{tone}         accent: a border, an icon, or a fill
//   --xd-on-{tone}            text on that fill
//   --xd-color-{tone}-subtle  a tinted background for normal text
// `error` reuses destructive, which only needed its subtle tint.
const TONES = ['success', 'info', 'warning'] as const;

const STATUS_TOKENS = [
  '--xd-color-destructive-subtle',
  ...TONES.flatMap((tone) => [
    `--xd-color-${tone}`,
    `--xd-on-${tone}`,
    `--xd-color-${tone}-subtle`,
  ]),
];

describe('status colour tokens — declared everywhere', () => {
  // Without these, a theme missing a token would silently inherit the
  // default theme's colour from tokens.css.
  describe.each(colourBlocks())('$file', (blocks) => {
    it.each(STATUS_TOKENS)(
      'declares %s in light and both dark blocks',
      (token) => {
        expect(blocks.light[token]).toBeDefined();
        expect(blocks.mediaDark[token]).toBeDefined();
        expect(blocks.explicitDark[token]).toBeDefined();
      },
    );

    it('uses the same dark values under prefers-color-scheme and data-mode="dark"', () => {
      for (const token of STATUS_TOKENS) {
        expect(blocks.explicitDark[token]).toBe(blocks.mediaDark[token]);
      }
    });
  });
});

const ALL_TONES = ['destructive', ...TONES] as const;

describe.each(resolvedThemes())(
  'status colour contrast — $theme ($mode)',
  ({ tokens }) => {
    const colour = (tone: string) => tokens[`--xd-color-${tone}`];
    const subtle = (tone: string) => tokens[`--xd-color-${tone}-subtle`];

    it.each(TONES)('--xd-on-%s on its fill meets 4.5:1 (text)', (tone) => {
      expect(
        contrastRatio(tokens[`--xd-on-${tone}`], colour(tone)),
      ).toBeGreaterThanOrEqual(4.5);
    });

    it.each(TONES)(
      '--xd-color-%s on the surface meets 3:1 (a border or icon)',
      (tone) => {
        expect(
          contrastRatio(colour(tone), tokens['--xd-color-surface']),
        ).toBeGreaterThanOrEqual(3);
      },
    );

    it.each(ALL_TONES)('text on --xd-color-%s-subtle meets 4.5:1', (tone) => {
      expect(
        contrastRatio(tokens['--xd-color-text'], subtle(tone)),
      ).toBeGreaterThanOrEqual(4.5);
    });

    it.each(ALL_TONES)(
      '--xd-color-%s on its subtle tint meets 3:1 (a border or icon)',
      (tone) => {
        expect(
          contrastRatio(colour(tone), subtle(tone)),
        ).toBeGreaterThanOrEqual(3);
      },
    );

    it.each(ALL_TONES)(
      'the %s tint is visibly different from the surface',
      (tone) => {
        expect(
          contrastRatio(subtle(tone), tokens['--xd-color-surface']),
        ).toBeGreaterThanOrEqual(1.05);
      },
    );
  },
);
