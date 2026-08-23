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
