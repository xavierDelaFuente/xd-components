import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { getButton } from '@asnewyla/button/test-utils';
import { IconButton } from '../components/IconButton';

const MockIcon = () => (
  <svg aria-hidden="true" data-testid="mock-icon" viewBox="0 0 24 24">
    <path d="M12 2L2 22h20L12 2z" />
  </svg>
);

describe('IconButton', () => {
  it('has accessible label via aria-label', () => {
    render(<IconButton icon={<MockIcon />} label="Save file" />);
    expect(getButton(/save file/i)).toBeInTheDocument();
  });

  it('renders the icon inside the button', () => {
    render(<IconButton icon={<MockIcon />} label="Save" />);
    const icon = screen.getByTestId('mock-icon');
    expect(getButton()).toContainElement(icon);
  });

  it('hides the icon from assistive technology', () => {
    render(<IconButton icon={<MockIcon />} label="Save" />);
    const icon = screen.getByTestId('mock-icon');
    expect(icon.closest('[aria-hidden="true"]')).not.toBeNull();
  });

  it('renders no visible text content', () => {
    render(<IconButton icon={<MockIcon />} label="Save" />);
    expect(getButton().textContent?.trim()).toBe('');
  });

  it('accepts variant prop', () => {
    render(
      <IconButton icon={<MockIcon />} label="Delete" variant="destructive" />,
    );
    expect(getButton()).toHaveAttribute('data-variant', 'destructive');
  });

  it('accepts size prop', () => {
    render(<IconButton icon={<MockIcon />} label="Save" size="lg" />);
    expect(getButton()).toHaveAttribute('data-size', 'lg');
  });

  it('does not respond to clicks when disabled', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    render(
      <IconButton
        icon={<MockIcon />}
        label="Save"
        disabled
        onClick={handleClick}
      />,
    );
    await user.click(getButton());
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('forwards ref to the underlying button element', () => {
    const ref = { current: null } as React.RefObject<HTMLButtonElement>;
    render(<IconButton ref={ref} icon={<MockIcon />} label="Save" />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});
