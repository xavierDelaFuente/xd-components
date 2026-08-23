import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ThemeProvider } from '../components';

describe('ThemeProvider', () => {
  it('renders children', () => {
    render(
      <ThemeProvider theme="theme1">
        <span>content</span>
      </ThemeProvider>,
    );
    expect(screen.getByText('content')).toBeInTheDocument();
  });

  it('sets data-theme on the document root to the given theme', () => {
    render(
      <ThemeProvider theme="theme1">
        <span>content</span>
      </ThemeProvider>,
    );
    expect(document.documentElement).toHaveAttribute('data-theme', 'theme1');
  });

  it('updates data-theme on the document root when the theme prop changes', () => {
    const { rerender } = render(
      <ThemeProvider theme="theme1">
        <span>content</span>
      </ThemeProvider>,
    );
    rerender(
      <ThemeProvider theme="theme2">
        <span>content</span>
      </ThemeProvider>,
    );
    expect(document.documentElement).toHaveAttribute('data-theme', 'theme2');
  });

  it('removes data-theme from the document root on unmount', () => {
    const { unmount } = render(
      <ThemeProvider theme="theme1">
        <span>content</span>
      </ThemeProvider>,
    );
    unmount();
    expect(document.documentElement).not.toHaveAttribute('data-theme');
  });
});

describe('ThemeProvider — mode', () => {
  it('does not set data-mode on the document root when mode is not provided', () => {
    render(
      <ThemeProvider theme="theme1">
        <span>content</span>
      </ThemeProvider>,
    );
    expect(document.documentElement).not.toHaveAttribute('data-mode');
  });

  it.each(['light', 'dark'] as const)(
    'sets data-mode to %s on the document root when provided',
    (mode) => {
      render(
        <ThemeProvider theme="theme1" mode={mode}>
          <span>content</span>
        </ThemeProvider>,
      );
      expect(document.documentElement).toHaveAttribute('data-mode', mode);
    },
  );

  it('updates data-mode on the document root when the mode prop changes', () => {
    const { rerender } = render(
      <ThemeProvider theme="theme1" mode="light">
        <span>content</span>
      </ThemeProvider>,
    );
    rerender(
      <ThemeProvider theme="theme1" mode="dark">
        <span>content</span>
      </ThemeProvider>,
    );
    expect(document.documentElement).toHaveAttribute('data-mode', 'dark');
  });

  it('removes data-mode from the document root when mode changes from set to unset', () => {
    const { rerender } = render(
      <ThemeProvider theme="theme1" mode="dark">
        <span>content</span>
      </ThemeProvider>,
    );
    rerender(
      <ThemeProvider theme="theme1">
        <span>content</span>
      </ThemeProvider>,
    );
    expect(document.documentElement).not.toHaveAttribute('data-mode');
  });

  it('removes data-mode from the document root on unmount', () => {
    const { unmount } = render(
      <ThemeProvider theme="theme1" mode="dark">
        <span>content</span>
      </ThemeProvider>,
    );
    unmount();
    expect(document.documentElement).not.toHaveAttribute('data-mode');
  });

  it('sets data-theme and data-mode independently, without one clobbering the other', () => {
    render(
      <ThemeProvider theme="theme2" mode="dark">
        <span>content</span>
      </ThemeProvider>,
    );
    expect(document.documentElement).toHaveAttribute('data-theme', 'theme2');
    expect(document.documentElement).toHaveAttribute('data-mode', 'dark');
  });
});
