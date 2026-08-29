import { getTextarea } from '@asnewyla/unstyled-textarea/test-utils';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Textarea } from '../components';

describe('Textarea', () => {
  it('renders the label text', () => {
    render(<Textarea label="Bio" />);

    expect(screen.getByText('Bio')).toBeInTheDocument();
  });

  it('associates the label with the input — clicking the label focuses it', async () => {
    const user = userEvent.setup();
    render(<Textarea label="Bio" />);

    const textarea = getTextarea('Bio');
    expect(textarea).not.toHaveFocus();

    await user.click(screen.getByText('Bio'));

    expect(textarea).toHaveFocus();
  });

  it('auto-generates a unique id when none is provided', () => {
    render(
      <>
        <Textarea label="Bio" />
        <Textarea label="Cover letter" />
      </>,
    );

    const first = getTextarea('Bio');
    const last = getTextarea('Cover letter');

    expect(first.id).toBeTruthy();
    expect(last.id).toBeTruthy();
    expect(first.id).not.toBe(last.id);
  });

  it('respects an explicitly-provided id', () => {
    render(<Textarea label="Bio" id="custom-id" />);

    expect(getTextarea('Bio')).toHaveAttribute('id', 'custom-id');
  });

  it('renders no error message when error is not provided', () => {
    render(<Textarea label="Bio" />);

    expect(screen.queryByRole('textbox')).not.toHaveAttribute(
      'aria-describedby',
    );
  });

  it('renders the error message text when error is provided', () => {
    render(<Textarea label="Bio" error="Bio is required" />);

    expect(screen.getByText('Bio is required')).toBeInTheDocument();
  });

  it('links the input to the error message via aria-describedby', () => {
    render(<Textarea label="Bio" error="Bio is required" />);

    const textarea = getTextarea('Bio');
    const describedById = textarea.getAttribute('aria-describedby');

    expect(describedById).toBeTruthy();
    expect(document.getElementById(describedById as string)).toHaveTextContent(
      'Bio is required',
    );
  });

  it('sets aria-invalid on the input when error is provided', () => {
    render(<Textarea label="Bio" error="Bio is required" />);

    expect(getTextarea('Bio')).toHaveAttribute('aria-invalid', 'true');
  });

  it('does not set aria-invalid when error is not provided', () => {
    render(<Textarea label="Bio" id="bio" />);

    expect(getTextarea('Bio')).not.toHaveAttribute('aria-invalid');
    expect(screen.queryByTestId('bio-error')).not.toBeInTheDocument();
  });

  it('forwards disabled to the underlying input', () => {
    render(<Textarea label="Bio" disabled />);

    expect(getTextarea('Bio')).toBeDisabled();
  });

  it('merges a consumer className with the base xd-textarea-input class', () => {
    render(<Textarea label="Bio" className="my-textarea" />);

    expect(getTextarea('Bio')).toHaveClass('xd-textarea-input', 'my-textarea');
  });

  it('forwards a ref to the underlying textarea element', () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<Textarea label="Bio" ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });

  it('passes through arbitrary native textarea attributes', () => {
    render(<Textarea label="Bio" rows={8} />);

    expect(getTextarea('Bio')).toHaveAttribute('rows', '8');
  });

  it('still sets data-focused on the underlying input when the consumer passes their own onFocus', () => {
    const handleFocus = vi.fn();
    render(<Textarea label="Bio" onFocus={handleFocus} />);

    const textarea = getTextarea('Bio');
    fireEvent.focus(textarea);

    expect(handleFocus).toHaveBeenCalled();
    expect(textarea).toHaveAttribute('data-focused', 'true');
  });
});
