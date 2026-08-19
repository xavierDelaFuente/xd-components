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
});
