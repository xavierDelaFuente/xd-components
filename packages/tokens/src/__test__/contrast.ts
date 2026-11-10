import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const THEME_NAMES = [
  'terra',
  'almanac',
  'block',
  'graphite',
  'rubber',
  'terminal',
] as const;

type Tokens = Record<string, string>;

const read = (file: string) =>
  readFileSync(resolve(__dirname, '..', file), 'utf-8').replace(
    /\/\*[\s\S]*?\*\//g,
    '',
  );

function declarationsAfter(css: string, marker: string): Tokens {
  const start = css.indexOf(marker);
  if (start === -1) return {};
  const block = css.slice(start + marker.length).split('}')[0];
  return Object.fromEntries(
    [...block.matchAll(/(--xd-[\w-]+):\s*([^;]+);/g)].map(([, k, v]) => [
      k,
      v.trim(),
    ]),
  );
}

/**
 * Resolved colour tokens for every theme and mode, read from the CSS files.
 * A theme inherits whatever it doesn't redeclare from tokens.css, and dark
 * mode inherits whatever it doesn't redeclare from light.
 */
export function resolvedThemes() {
  const base = read('tokens.css');
  const baseLight = declarationsAfter(base, ':root {');
  const baseDark = {
    ...baseLight,
    ...declarationsAfter(base, ':root[data-mode="dark"] {'),
  };
  const rows: { theme: string; mode: 'light' | 'dark'; tokens: Tokens }[] = [
    { theme: 'default', mode: 'light', tokens: baseLight },
    { theme: 'default', mode: 'dark', tokens: baseDark },
  ];
  for (const theme of THEME_NAMES) {
    const css = read(`theme-${theme}.css`);
    const light = {
      ...baseLight,
      ...declarationsAfter(css, `[data-theme="${theme}"] {`),
    };
    const dark = {
      ...baseDark,
      ...light,
      ...declarationsAfter(css, `[data-theme="${theme}"][data-mode="dark"] {`),
    };
    rows.push({ theme, mode: 'light', tokens: light });
    rows.push({ theme, mode: 'dark', tokens: dark });
  }
  return rows;
}

const srgbToLinear = (channel: number) =>
  channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;

/** Linear sRGB channels (0–1, gamut-clamped) for a hex or oklch() colour. */
function toLinearRgb(colour: string): [number, number, number] {
  const hex = colour.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i)?.[1];
  if (hex) {
    const full = hex.length === 3 ? [...hex].map((c) => c + c).join('') : hex;
    const [r, g, b] = [0, 2, 4].map(
      (i) => Number.parseInt(full.slice(i, i + 2), 16) / 255,
    );
    return [srgbToLinear(r), srgbToLinear(g), srgbToLinear(b)];
  }
  const lch = colour.match(/^oklch\(\s*([\d.]+)%\s+([\d.]+)\s+([\d.]+)\s*\)$/);
  if (!lch) throw new Error(`Unsupported colour: ${colour}`);
  // OKLCH → OKLab → linear sRGB (Björn Ottosson's reference matrices).
  const L = Number(lch[1]) / 100;
  const hue = (Number(lch[3]) * Math.PI) / 180;
  const a = Number(lch[2]) * Math.cos(hue);
  const b = Number(lch[2]) * Math.sin(hue);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const clamp = (v: number) => Math.min(1, Math.max(0, v));
  return [
    clamp(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    clamp(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    clamp(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ];
}

const luminance = (colour: string) => {
  const [r, g, b] = toLinearRgb(colour);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

/** WCAG 2 contrast ratio between two colours (1–21). */
export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}
