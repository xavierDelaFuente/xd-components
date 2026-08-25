import { createRef } from 'react';
import { fireEvent, render } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UnstyledInput } from '../components';
import { getInput } from '../test-utils';

let user: UserEvent;

beforeEach(() => {
  user = userEvent.setup();
});

describe('UnstyledInput', () => {
  it('renders a text input', () => {
    render(<UnstyledInput aria-label="Name" />);

    expect(getInput()).toBeInTheDocument();
  });

  it('is uncontrolled by default — starts at defaultValue and updates as the user types', async () => {
    render(<UnstyledInput aria-label="Name" defaultValue="Jo" />);
    const input = getInput();

    expect(input).toHaveValue('Jo');
    await user.type(input, 'rdan');
    expect(input).toHaveValue('Jordan');
  });

  it('supports controlled usage via value + onChange', async () => {
    const handleChange = vi.fn();
    render(
      <UnstyledInput aria-label="Name" value="Jo" onChange={handleChange} />,
    );

    const input = getInput();

    expect(input).toHaveValue('Jo');
    await user.type(input, 'x');
    expect(handleChange).toHaveBeenCalled();
    expect(input).toHaveValue('Jo');
  });

  it('calls onChange with the actual typed value in the event', async () => {
    let value: string | undefined;
    const handleChange = vi.fn((e: React.ChangeEvent<HTMLInputElement>) => {
      value = e.target.value;
    });
    render(
      <UnstyledInput aria-label="Name" value="Jo" onChange={handleChange} />,
    );

    await user.type(getInput(), 'x');

    expect(value).toBe('Jox');
  });

  it('is focusable via Tab key', async () => {
    render(<UnstyledInput aria-label="Name" />);

    await user.tab();

    expect(getInput()).toHaveFocus();
  });

  it('sets data-focused on focus and clears it on blur', () => {
    render(<UnstyledInput aria-label="Name" />);
    const input = getInput();

    fireEvent.focus(input);
    expect(input).toHaveAttribute('data-focused', 'true');

    fireEvent.blur(input);
    expect(input).not.toHaveAttribute('data-focused');
  });

  it('sets data-disabled when disabled', () => {
    render(<UnstyledInput aria-label="Name" disabled />);

    expect(getInput()).toHaveAttribute('data-disabled', 'true');
  });

  it('is not editable when disabled', async () => {
    render(<UnstyledInput aria-label="Name" disabled defaultValue="" />);

    const input = getInput();
    await user.type(input, 'nope');

    expect(input).toHaveValue('');
  });

  it('sets data-invalid and aria-invalid when invalid', () => {
    render(<UnstyledInput aria-label="Name" invalid />);

    const input = getInput();

    expect(input).toHaveAttribute('data-invalid', 'true');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('omits data-invalid and aria-invalid when not invalid', () => {
    render(<UnstyledInput aria-label="Name" />);

    const input = getInput();

    expect(input).not.toHaveAttribute('data-invalid');
    expect(input).not.toHaveAttribute('aria-invalid');
  });

  it('forwards a ref to the underlying input element', () => {
    const ref = createRef<HTMLInputElement>();
    render(<UnstyledInput aria-label="Name" ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('passes through arbitrary native input attributes', () => {
    render(
      <UnstyledInput aria-label="Name" placeholder="e.g. Jordan" type="text" />,
    );

    expect(getInput()).toHaveAttribute('placeholder', 'e.g. Jordan');
    expect(getInput()).toHaveAttribute('type', 'text');
  });

  it('still tracks data-focused even when the consumer passes their own onFocus', () => {
    const handleFocus = vi.fn();
    render(<UnstyledInput aria-label="Name" onFocus={handleFocus} />);

    const input = getInput();
    fireEvent.focus(input);

    expect(handleFocus).toHaveBeenCalled();
    expect(input).toHaveAttribute('data-focused', 'true');
  });

  it('still tracks data-focused clearing even when the consumer passes their own onBlur', () => {
    const handleBlur = vi.fn();
    render(<UnstyledInput aria-label="Name" onBlur={handleBlur} />);

    const input = getInput();
    fireEvent.focus(input);
    fireEvent.blur(input);

    expect(handleBlur).toHaveBeenCalled();
    expect(input).not.toHaveAttribute('data-focused');
  });
});
