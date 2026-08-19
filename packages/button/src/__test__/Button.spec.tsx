import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Button } from '../components/Button';

describe('Button', () => {
  it('renders with text content', () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
  });

  it('applies primary variant by default', () => {
    render(<Button>Primary</Button>);
    expect(screen.getByRole('button')).toHaveAttribute(
      'data-variant',
      'primary',
    );
  });

  it('applies secondary variant when specified', () => {
    render(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole('button')).toHaveAttribute(
      'data-variant',
      'secondary',
    );
  });

  it('applies destructive variant when specified', () => {
    render(<Button variant="destructive">Delete</Button>);
    expect(screen.getByRole('button')).toHaveAttribute(
      'data-variant',
      'destructive',
    );
  });

  it('applies md size by default', () => {
    render(<Button>Medium</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('data-size', 'md');
  });

  const sizes = ['sm', 'md', 'lg'] as const;
  it.each(sizes)('applies %s size when specified', (size) => {
    render(<Button size={size}>text</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('data-size', size);
  });
});