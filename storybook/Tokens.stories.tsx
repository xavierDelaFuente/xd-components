import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Foundations/Tokens',
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

const colorTokens = [
  ['--xd-color-primary', '--xd-on-primary'],
  ['--xd-color-secondary', '--xd-on-secondary'],
  ['--xd-color-destructive', '--xd-on-destructive'],
] as const;

export const Colors: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem' }}>
      {colorTokens.map(([bg, fg]) => (
        <div
          key={bg}
          style={{
            background: `var(${bg})`,
            color: `var(${fg})`,
            padding: '1rem',
            borderRadius: 'var(--xd-radius-md)',
            fontSize: 'var(--xd-font-size-md)',
            fontWeight: 'var(--xd-font-weight-semibold)',
          }}
        >
          {bg}
        </div>
      ))}
    </div>
  ),
};

export const Spacing: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'].map((step) => (
        <div
          key={step}
          style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}
        >
          <code>--xd-space-{step}</code>
          <div
            style={{
              background: 'var(--xd-color-primary)',
              width: `var(--xd-space-${step})`,
              height: '1rem',
            }}
          />
        </div>
      ))}
    </div>
  ),
};

export const Radius: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem' }}>
      {['sm', 'md', 'lg', 'full'].map((step) => (
        <div
          key={step}
          style={{
            background: 'var(--xd-color-primary)',
            width: '4rem',
            height: '4rem',
            borderRadius: `var(--xd-radius-${step})`,
          }}
        />
      ))}
    </div>
  ),
};

export const Typography: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {['sm', 'md', 'lg'].map((step) => (
        <p
          key={step}
          style={{ fontSize: `var(--xd-font-size-${step})`, margin: 0 }}
        >
          --xd-font-size-{step}
        </p>
      ))}
    </div>
  ),
};

export const FontFamily: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <p style={{ fontFamily: 'var(--xd-font-family)', margin: 0 }}>
        --xd-font-family: The quick brown fox jumps over the lazy dog
      </p>
      <p style={{ fontFamily: 'var(--xd-font-family-mono)', margin: 0 }}>
        --xd-font-family-mono: The quick brown fox jumps over the lazy dog
      </p>
    </div>
  ),
};
