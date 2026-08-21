import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { UnstyledInput } from '../components';

describe('UnstyledInput', () => {
  it('renders a text input', () => {
    render(<UnstyledInput aria-label="Name" />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('is uncontrolled by default — starts at defaultValue and updates as the user types', async () => {
    const user = userEvent.setup();
    render(<UnstyledInput aria-label="Name" defaultValue="Jo" />);
    const input = screen.getByRole('textbox');
    // Asserted before typing: proves defaultValue is actually forwarded to
    // the input, not just that a bare <input> accepts keystrokes natively.
    expect(input).toHaveValue('Jo');
    await user.type(input, 'rdan');
    expect(input).toHaveValue('Jordan');
  });

  it('supports controlled usage via value + onChange', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <UnstyledInput aria-label="Name" value="Jo" onChange={handleChange} />,
    );
    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('Jo');
    await user.type(input, 'x');
    expect(handleChange).toHaveBeenCalled();
    // Controlled: without the consumer updating `value`, the DOM value doesn't change on its own
    expect(input).toHaveValue('Jo');
  });

  it('sets data-focused on focus and clears it on blur', () => {
    render(<UnstyledInput aria-label="Name" />);
    const input = screen.getByRole('textbox');

    fireEvent.focus(input);
    expect(input).toHaveAttribute('data-focused', 'true');

    fireEvent.blur(input);
    expect(input).not.toHaveAttribute('data-focused');
  });

  it('sets data-disabled when disabled', () => {
    render(<UnstyledInput aria-label="Name" disabled />);
    expect(screen.getByRole('textbox')).toHaveAttribute(
      'data-disabled',
      'true',
    );
  });

  it('is not editable when disabled', async () => {
    const user = userEvent.setup();
    render(<UnstyledInput aria-label="Name" disabled defaultValue="" />);
    const input = screen.getByRole('textbox');
    await user.type(input, 'nope');
    expect(input).toHaveValue('');
  });

  it('sets data-invalid and aria-invalid when invalid', () => {
    render(<UnstyledInput aria-label="Name" invalid />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('data-invalid', 'true');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('omits data-invalid and aria-invalid when not invalid', () => {
    render(<UnstyledInput aria-label="Name" />);
    const input = screen.getByRole('textbox');
    expect(input).not.toHaveAttribute('data-invalid');
    expect(input).not.toHaveAttribute('aria-invalid');
  });

  it('forwards a ref to the underlying input element', () => {
    const ref = createRef<HTMLInputElement>();
    render(<UnstyledInput aria-label="Name" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('passes through arbitrary native input attributes', () => {
    render(<UnstyledInput aria-label="Name" placeholder="e.g. Jordan" type="text" />);
    expect(screen.getByRole('textbox')).toHaveAttribute(
      'placeholder',
      'e.g. Jordan',
    );
  });
});
