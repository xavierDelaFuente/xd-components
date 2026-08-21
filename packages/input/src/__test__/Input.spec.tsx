import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Input } from '../components';

describe('Input', () => {
  it('renders the label text', () => {
    render(<Input label="Name" />);

    expect(screen.getByText('Name')).toBeInTheDocument();
  });

  it('associates the label with the input — clicking the label focuses it', async () => {
    const user = userEvent.setup();
    render(<Input label="Name" />);

    await user.click(screen.getByText('Name'));

    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveFocus();
  });

  it('auto-generates a unique id when none is provided', () => {
    render(
      <>
        <Input label="First name" />
        <Input label="Last name" />
      </>,
    );

    const first = screen.getByRole('textbox', { name: 'First name' });
    const last = screen.getByRole('textbox', { name: 'Last name' });

    expect(first.id).toBeTruthy();
    expect(last.id).toBeTruthy();
    expect(first.id).not.toBe(last.id);
  });

  it('respects an explicitly-provided id', () => {
    render(<Input label="Name" id="custom-id" />);

    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveAttribute(
      'id',
      'custom-id',
    );
  });

  it('renders no error message when error is not provided', () => {
    render(<Input label="Email" />);

    expect(screen.queryByRole('textbox')).not.toHaveAttribute(
      'aria-describedby',
    );
  });

  it('renders the error message text when error is provided', () => {
    render(<Input label="Email" error="Enter a valid email address" />);

    expect(screen.getByText('Enter a valid email address')).toBeInTheDocument();
  });

  it('links the input to the error message via aria-describedby', () => {
    render(<Input label="Email" error="Enter a valid email address" />);

    const input = screen.getByRole('textbox', { name: 'Email' });
    const describedById = input.getAttribute('aria-describedby');

    expect(describedById).toBeTruthy();
    expect(document.getElementById(describedById as string)).toHaveTextContent(
      'Enter a valid email address',
    );
  });

  it('sets aria-invalid on the input when error is provided', () => {
    render(<Input label="Email" error="Enter a valid email address" />);

    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveAttribute(
      'aria-invalid',
      'true',
    );
  });

  it('does not set aria-invalid when error is not provided', () => {
    render(<Input label="Email" id="email" />);

    expect(screen.getByRole('textbox', { name: 'Email' })).not.toHaveAttribute(
      'aria-invalid',
    );
    expect(screen.queryByTestId('email-error')).not.toBeInTheDocument();
  });

  it('forwards disabled to the underlying input', () => {
    render(<Input label="Name" disabled />);

    expect(screen.getByRole('textbox', { name: 'Name' })).toBeDisabled();
  });

  it('forwards a ref to the underlying input element', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input label="Name" ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('passes through arbitrary native input attributes', () => {
    render(<Input label="Name" placeholder="e.g. Jordan" />);

    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveAttribute(
      'placeholder',
      'e.g. Jordan',
    );
  });

  it('still sets data-focused on the underlying input when the consumer passes their own onFocus', () => {
    const handleFocus = vi.fn();
    render(<Input label="Name" onFocus={handleFocus} />);

    const input = screen.getByRole('textbox', { name: 'Name' });
    fireEvent.focus(input);

    expect(handleFocus).toHaveBeenCalled();
    expect(input).toHaveAttribute('data-focused', 'true');
  });
});
