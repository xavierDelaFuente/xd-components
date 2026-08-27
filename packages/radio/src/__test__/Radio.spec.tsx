import { fireEvent, render, screen } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import { createRef } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Radio } from '../components';
import { getRadio } from '../test-utils';

let user: UserEvent;

beforeEach(() => {
  user = userEvent.setup();
});

describe('Radio', () => {
  it('renders the label text', () => {
    render(<Radio label="Option A" />);

    expect(screen.getByText('Option A')).toBeInTheDocument();
  });

  it('associates the label with the input — clicking the label checks it', async () => {
    render(<Radio label="Option A" defaultChecked={false} />);

    const radio = getRadio('Option A');
    expect(radio).not.toBeChecked();

    await user.click(screen.getByText('Option A'));

    expect(radio).toBeChecked();
  });

  it('auto-generates a unique id when none is provided', () => {
    render(
      <>
        <Radio label="Option A" />
        <Radio label="Option B" />
      </>,
    );

    const first = getRadio('Option A');
    const last = getRadio('Option B');

    expect(first.id).toBeTruthy();
    expect(last.id).toBeTruthy();
    expect(first.id).not.toBe(last.id);
  });

  it('respects an explicitly-provided id', () => {
    render(<Radio label="Option A" id="custom-id" />);

    expect(getRadio('Option A')).toHaveAttribute('id', 'custom-id');
  });

  it('renders no error message when error is not provided', () => {
    render(<Radio label="Option A" />);

    expect(screen.queryByRole('radio')).not.toHaveAttribute('aria-describedby');
  });

  it('renders the error message text when error is provided', () => {
    render(<Radio label="Option A" error="You must choose an option" />);

    expect(screen.getByText('You must choose an option')).toBeInTheDocument();
  });

  it('links the input to the error message via aria-describedby', () => {
    render(<Radio label="Option A" error="You must choose an option" />);

    const radio = getRadio('Option A');
    const describedById = radio.getAttribute('aria-describedby');

    expect(describedById).toBeTruthy();
    expect(document.getElementById(describedById as string)).toHaveTextContent(
      'You must choose an option',
    );
  });

  it('sets aria-invalid on the input when error is provided', () => {
    render(<Radio label="Option A" error="You must choose an option" />);

    expect(getRadio('Option A')).toHaveAttribute('aria-invalid', 'true');
  });

  it('does not set aria-invalid when error is not provided', () => {
    render(<Radio label="Option A" id="option-a" />);

    expect(getRadio('Option A')).not.toHaveAttribute('aria-invalid');
    expect(screen.queryByTestId('option-a-error')).not.toBeInTheDocument();
  });

  it('forwards disabled to the underlying input', () => {
    render(<Radio label="Option A" disabled />);

    expect(getRadio('Option A')).toBeDisabled();
  });

  it('merges a consumer className with the base xd-radio-input class', () => {
    render(<Radio label="Option A" className="my-radio" />);

    expect(getRadio('Option A')).toHaveClass('xd-radio-input', 'my-radio');
  });

  it('forwards a ref to the underlying input element', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Radio label="Option A" ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('passes through arbitrary native input attributes', () => {
    render(<Radio label="Option A" name="choice" value="a" />);

    const radio = getRadio('Option A');
    expect(radio).toHaveAttribute('name', 'choice');
    expect(radio).toHaveAttribute('value', 'a');
  });

  it('still sets data-focused on the underlying input when the consumer passes their own onFocus', () => {
    const handleFocus = vi.fn();
    render(<Radio label="Option A" onFocus={handleFocus} />);

    const radio = getRadio('Option A');
    fireEvent.focus(radio);

    expect(handleFocus).toHaveBeenCalled();
    expect(radio).toHaveAttribute('data-focused', 'true');
  });
});
