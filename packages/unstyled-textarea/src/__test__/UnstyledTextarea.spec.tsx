import { fireEvent, render } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import { createRef } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UnstyledTextarea } from '../components';
import { getTextarea } from '../test-utils';

let user: UserEvent;

beforeEach(() => {
  user = userEvent.setup();
});

describe('UnstyledTextarea', () => {
  it('renders a multi-line text input', () => {
    render(<UnstyledTextarea aria-label="Bio" />);

    expect(getTextarea().tagName).toBe('TEXTAREA');
  });

  it('sets no explicit role — relies on the native implicit textbox role', () => {
    render(<UnstyledTextarea aria-label="Bio" />);

    expect(getTextarea()).not.toHaveAttribute('role');
  });

  it('keeps its own computed data-focused even if a same-named raw prop is also passed', () => {
    render(<UnstyledTextarea aria-label="Bio" data-focused="true" />);

    expect(getTextarea()).not.toHaveAttribute('data-focused');
  });

  it('is uncontrolled by default — starts at defaultValue and updates as the user types', async () => {
    render(<UnstyledTextarea aria-label="Bio" defaultValue="Jo" />);
    const textarea = getTextarea();

    expect(textarea).toHaveValue('Jo');
    await user.type(textarea, 'rdan');
    expect(textarea).toHaveValue('Jordan');
  });

  it('supports controlled usage via value + onChange', async () => {
    const handleChange = vi.fn();
    render(
      <UnstyledTextarea aria-label="Bio" value="Jo" onChange={handleChange} />,
    );

    const textarea = getTextarea();

    expect(textarea).toHaveValue('Jo');
    await user.type(textarea, 'x');
    expect(handleChange).toHaveBeenCalled();
    expect(textarea).toHaveValue('Jo');
  });

  it('calls onChange with the actual typed value in the event', async () => {
    let value: string | undefined;
    const handleChange = vi.fn((e: React.ChangeEvent<HTMLTextAreaElement>) => {
      value = e.target.value;
    });
    render(
      <UnstyledTextarea aria-label="Bio" value="Jo" onChange={handleChange} />,
    );

    await user.type(getTextarea(), 'x');

    expect(value).toBe('Jox');
  });

  it('supports multi-line values, newlines included', async () => {
    render(<UnstyledTextarea aria-label="Bio" defaultValue="" />);
    const textarea = getTextarea();

    await user.type(textarea, 'Line one{enter}Line two');

    expect(textarea).toHaveValue('Line one\nLine two');
  });

  it('is focusable via Tab key', async () => {
    render(<UnstyledTextarea aria-label="Bio" />);

    await user.tab();

    expect(getTextarea()).toHaveFocus();
  });

  it('sets data-focused on focus and clears it on blur', () => {
    render(<UnstyledTextarea aria-label="Bio" />);
    const textarea = getTextarea();

    fireEvent.focus(textarea);
    expect(textarea).toHaveAttribute('data-focused', 'true');

    fireEvent.blur(textarea);
    expect(textarea).not.toHaveAttribute('data-focused');
  });

  it('sets data-disabled when disabled', () => {
    render(<UnstyledTextarea aria-label="Bio" disabled />);

    expect(getTextarea()).toHaveAttribute('data-disabled', 'true');
  });

  it('is not editable when disabled', async () => {
    render(<UnstyledTextarea aria-label="Bio" disabled defaultValue="" />);

    const textarea = getTextarea();
    await user.type(textarea, 'nope');

    expect(textarea).toHaveValue('');
  });

  it('sets data-invalid and aria-invalid when invalid', () => {
    render(<UnstyledTextarea aria-label="Bio" invalid />);

    const textarea = getTextarea();

    expect(textarea).toHaveAttribute('data-invalid', 'true');
    expect(textarea).toHaveAttribute('aria-invalid', 'true');
  });

  it('omits data-invalid and aria-invalid when not invalid', () => {
    render(<UnstyledTextarea aria-label="Bio" />);

    const textarea = getTextarea();

    expect(textarea).not.toHaveAttribute('data-invalid');
    expect(textarea).not.toHaveAttribute('aria-invalid');
  });

  it('forwards a ref to the underlying textarea element', () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<UnstyledTextarea aria-label="Bio" ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });

  it('passes through arbitrary native textarea attributes', () => {
    render(
      <UnstyledTextarea
        aria-label="Bio"
        rows={6}
        placeholder="Tell us about yourself"
      />,
    );

    expect(getTextarea()).toHaveAttribute('rows', '6');
    expect(getTextarea()).toHaveAttribute(
      'placeholder',
      'Tell us about yourself',
    );
  });

  it('still tracks data-focused even when the consumer passes their own onFocus', () => {
    const handleFocus = vi.fn();
    render(<UnstyledTextarea aria-label="Bio" onFocus={handleFocus} />);

    const textarea = getTextarea();
    fireEvent.focus(textarea);

    expect(handleFocus).toHaveBeenCalled();
    expect(textarea).toHaveAttribute('data-focused', 'true');
  });

  it('still tracks data-focused clearing even when the consumer passes their own onBlur', () => {
    const handleBlur = vi.fn();
    render(<UnstyledTextarea aria-label="Bio" onBlur={handleBlur} />);

    const textarea = getTextarea();
    fireEvent.focus(textarea);
    fireEvent.blur(textarea);

    expect(handleBlur).toHaveBeenCalled();
    expect(textarea).not.toHaveAttribute('data-focused');
  });
});
