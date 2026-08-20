import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { IconButton } from '../components/IconButton';

const MockIcon = () => (
  <svg data-testid="mock-icon" viewBox="0 0 24 24">
    <path d="M12 2L2 22h20L12 2z" />
  </svg>
);

describe('IconButton', () => {
  it('has accessible label via aria-label', () => {
    render(<IconButton icon={<MockIcon />} label="Save file" />);
    expect(
      screen.getByRole('button', { name: /save file/i }),
    ).toBeInTheDocument();
  });

  it('renders the icon inside the button', () => {
    render(<IconButton icon={<MockIcon />} label="Save" />);
    const button = screen.getByRole('button');
    const icon = screen.getByTestId('mock-icon');
    expect(button).toContainElement(icon);
  });

  it('hides the icon from assistive technology', () => {
    render(<IconButton icon={<MockIcon />} label="Save" />);
    const icon = screen.getByTestId('mock-icon');
    expect(icon.closest('[aria-hidden="true"]')).not.toBeNull();
  });

  it('renders no visible text content', () => {
    render(<IconButton icon={<MockIcon />} label="Save" />);
    expect(screen.getByRole('button').textContent?.trim()).toBe('');
  });

  it('accepts variant prop', () => {
    render(
      <IconButton icon={<MockIcon />} label="Delete" variant="destructive" />,
    );
    expect(screen.getByRole('button')).toHaveAttribute(
      'data-variant',
      'destructive',
    );
  });

  it('accepts size prop', () => {
    render(<IconButton icon={<MockIcon />} label="Save" size="lg" />);
    expect(screen.getByRole('button')).toHaveAttribute('data-size', 'lg');
  });
});
