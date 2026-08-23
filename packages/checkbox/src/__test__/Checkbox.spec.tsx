import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Checkbox } from '../components';

describe('Checkbox', () => {
  it('renders the label text', () => {
    render(<Checkbox label="Accept terms" />);

    expect(screen.getByText('Accept terms')).toBeInTheDocument();
  });

  it('associates the label with the input — clicking the label toggles it', async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Accept terms" defaultChecked={false} />);

    const checkbox = screen.getByRole('checkbox', { name: 'Accept terms' });
    expect(checkbox).not.toBeChecked();

    await user.click(screen.getByText('Accept terms'));

    expect(checkbox).toBeChecked();
  });

  it('auto-generates a unique id when none is provided', () => {
    render(
      <>
        <Checkbox label="Accept terms" />
        <Checkbox label="Subscribe to updates" />
      </>,
    );

    const first = screen.getByRole('checkbox', { name: 'Accept terms' });
    const last = screen.getByRole('checkbox', { name: 'Subscribe to updates' });

    expect(first.id).toBeTruthy();
    expect(last.id).toBeTruthy();
    expect(first.id).not.toBe(last.id);
  });

  it('respects an explicitly-provided id', () => {
    render(<Checkbox label="Accept terms" id="custom-id" />);

    expect(
      screen.getByRole('checkbox', { name: 'Accept terms' }),
    ).toHaveAttribute('id', 'custom-id');
  });

  it('renders no error message when error is not provided', () => {
    render(<Checkbox label="Accept terms" />);

    expect(screen.queryByRole('checkbox')).not.toHaveAttribute(
      'aria-describedby',
    );
  });

  it('renders the error message text when error is provided', () => {
    render(<Checkbox label="Accept terms" error="You must accept the terms" />);

    expect(screen.getByText('You must accept the terms')).toBeInTheDocument();
  });

  it('links the input to the error message via aria-describedby', () => {
    render(<Checkbox label="Accept terms" error="You must accept the terms" />);

    const checkbox = screen.getByRole('checkbox', { name: 'Accept terms' });
    const describedById = checkbox.getAttribute('aria-describedby');

    expect(describedById).toBeTruthy();
    expect(document.getElementById(describedById as string)).toHaveTextContent(
      'You must accept the terms',
    );
  });

  it('sets aria-invalid on the input when error is provided', () => {
    render(<Checkbox label="Accept terms" error="You must accept the terms" />);

    expect(
      screen.getByRole('checkbox', { name: 'Accept terms' }),
    ).toHaveAttribute('aria-invalid', 'true');
  });

  it('does not set aria-invalid when error is not provided', () => {
    render(<Checkbox label="Accept terms" id="terms" />);

    expect(
      screen.getByRole('checkbox', { name: 'Accept terms' }),
    ).not.toHaveAttribute('aria-invalid');
    expect(screen.queryByTestId('terms-error')).not.toBeInTheDocument();
  });

  it('forwards disabled to the underlying input', () => {
    render(<Checkbox label="Accept terms" disabled />);

    expect(
      screen.getByRole('checkbox', { name: 'Accept terms' }),
    ).toBeDisabled();
  });

  it('merges a consumer className with the base xd-checkbox-input class', () => {
    render(<Checkbox label="Accept terms" className="my-checkbox" />);

    expect(screen.getByRole('checkbox', { name: 'Accept terms' })).toHaveClass(
      'xd-checkbox-input',
      'my-checkbox',
    );
  });

  it('forwards a ref to the underlying input element', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Checkbox label="Accept terms" ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('passes through arbitrary native input attributes', () => {
    render(<Checkbox label="Accept terms" name="terms" />);

    expect(
      screen.getByRole('checkbox', { name: 'Accept terms' }),
    ).toHaveAttribute('name', 'terms');
  });

  it('still sets data-focused on the underlying input when the consumer passes their own onFocus', () => {
    const handleFocus = vi.fn();
    render(<Checkbox label="Accept terms" onFocus={handleFocus} />);

    const checkbox = screen.getByRole('checkbox', { name: 'Accept terms' });
    fireEvent.focus(checkbox);

    expect(handleFocus).toHaveBeenCalled();
    expect(checkbox).toHaveAttribute('data-focused', 'true');
  });
});
