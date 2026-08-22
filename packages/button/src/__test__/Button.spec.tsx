import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Button } from '../components/Button';
import { ButtonGroupProvider } from '../components/ButtonGroupContext';

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

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    render(<Button onClick={handleClick}>Click</Button>);
    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('does not call onClick when disabled', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    render(
      <Button disabled onClick={handleClick}>
        Disabled
      </Button>,
    );
    await user.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('renders startIcon before children', () => {
    const StartIcon = () => <span data-testid="start-icon">★</span>;
    render(<Button startIcon={<StartIcon />}>Save</Button>);

    expect(screen.getByTestId('start-icon')).toBeInTheDocument();
  });

  it('renders endIcon after children', () => {
    const EndIcon = () => <span data-testid="end-icon">→</span>;
    render(<Button endIcon={<EndIcon />}>Next</Button>);

    expect(screen.getByTestId('end-icon')).toBeInTheDocument();
  });

  it('displays no icon if no startIcon or endIcon is provided', () => {
    render(<Button>No Icon</Button>);
    expect(screen.queryByTestId('start-icon')).not.toBeInTheDocument();
    expect(screen.queryByTestId('end-icon')).not.toBeInTheDocument();
  });

  it('hides startIcon wrapper from assistive tech', () => {
    render(
      <Button startIcon={<span data-testid="start-icon">★</span>}>Save</Button>,
    );
    const wrapper = screen.getByTestId('start-icon').parentElement;
    expect(wrapper).toHaveAttribute('aria-hidden', 'true');
    expect(wrapper).toHaveAttribute('data-slot', 'icon');
  });

  it('hides endIcon wrapper from assistive tech', () => {
    render(
      <Button endIcon={<span data-testid="end-icon">→</span>}>Next</Button>,
    );
    const wrapper = screen.getByTestId('end-icon').parentElement;
    expect(wrapper).toHaveAttribute('aria-hidden', 'true');
    expect(wrapper).toHaveAttribute('data-slot', 'icon');
  });

  it('renders as an anchor when as="a" is provided', () => {
    render(
      <Button as="a" href="/profile">
        Profile
      </Button>,
    );
    const link = screen.getByRole('link', { name: /profile/i });
    expect(link).toHaveAttribute('href', '/profile');
  });

  it('merges a consumer className with the base xd-button class', () => {
    render(<Button className="my-button">Save</Button>);
    expect(screen.getByRole('button')).toHaveClass('xd-button', 'my-button');
  });

  it('forwards ref to the underlying DOM element', () => {
    const ref = { current: null } as React.RefObject<HTMLButtonElement>;
    render(<Button ref={ref}>Ref test</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('resolves variant, size, and disabled from ButtonGroupProvider context', () => {
    render(
      <ButtonGroupProvider
        value={{ variant: 'secondary', size: 'lg', disabled: true }}
      >
        <Button>Grouped</Button>
      </ButtonGroupProvider>,
    );
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-variant', 'secondary');
    expect(button).toHaveAttribute('data-size', 'lg');
    expect(button).toBeDisabled();
  });

  it('lets an explicit prop override the group context value', () => {
    render(
      <ButtonGroupProvider
        value={{ variant: 'secondary', size: 'lg', disabled: true }}
      >
        <Button variant="destructive" size="sm" disabled={false}>
          Overridden
        </Button>
      </ButtonGroupProvider>,
    );
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-variant', 'destructive');
    expect(button).toHaveAttribute('data-size', 'sm');
    expect(button).not.toBeDisabled();
  });
});
