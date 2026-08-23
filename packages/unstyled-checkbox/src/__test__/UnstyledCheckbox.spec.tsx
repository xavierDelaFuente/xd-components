import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { UnstyledCheckbox } from '../components';

describe('UnstyledCheckbox', () => {
  it('renders a checkbox', () => {
    render(<UnstyledCheckbox aria-label="Accept terms" />);

    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('always renders as a checkbox input, regardless of any type override', () => {
    render(<UnstyledCheckbox aria-label="Accept terms" />);

    expect(screen.getByRole('checkbox')).toHaveAttribute('type', 'checkbox');
  });

  it('is uncontrolled by default — starts at defaultChecked and toggles on click', async () => {
    const user = userEvent.setup();
    render(
      <UnstyledCheckbox aria-label="Accept terms" defaultChecked={false} />,
    );
    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).not.toBeChecked();
    await user.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  it('supports controlled usage via checked + onChange', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <UnstyledCheckbox
        aria-label="Accept terms"
        checked={false}
        onChange={handleChange}
      />,
    );
    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).not.toBeChecked();
    await user.click(checkbox);
    expect(handleChange).toHaveBeenCalled();
    // still unchecked — nothing updated the checked prop, matching how a
    // controlled native input works
    expect(checkbox).not.toBeChecked();
  });

  it('calls onChange with the actual checked value in the event', async () => {
    const user = userEvent.setup();
    let checkedValue: boolean | undefined;
    const handleChange = vi.fn((e: React.ChangeEvent<HTMLInputElement>) => {
      checkedValue = e.target.checked;
    });
    render(
      <UnstyledCheckbox
        aria-label="Accept terms"
        checked={false}
        onChange={handleChange}
      />,
    );

    await user.click(screen.getByRole('checkbox'));

    expect(checkedValue).toBe(true);
  });

  it('calls a consumer-provided onChange even in uncontrolled mode', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <UnstyledCheckbox
        aria-label="Accept terms"
        defaultChecked={false}
        onChange={handleChange}
      />,
    );

    await user.click(screen.getByRole('checkbox'));

    expect(handleChange).toHaveBeenCalled();
  });

  it('sets data-checked to true when checked and removes it when unchecked (uncontrolled)', async () => {
    const user = userEvent.setup();
    render(
      <UnstyledCheckbox aria-label="Accept terms" defaultChecked={false} />,
    );
    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).not.toHaveAttribute('data-checked');
    await user.click(checkbox);
    expect(checkbox).toHaveAttribute('data-checked', 'true');
    await user.click(checkbox);
    expect(checkbox).not.toHaveAttribute('data-checked');
  });

  it('reflects data-checked from the checked prop when controlled', () => {
    render(
      <UnstyledCheckbox
        aria-label="Accept terms"
        checked
        onChange={() => {}}
      />,
    );

    expect(screen.getByRole('checkbox')).toHaveAttribute(
      'data-checked',
      'true',
    );
  });

  it('sets the indeterminate DOM property and data-indeterminate when indeterminate', () => {
    render(<UnstyledCheckbox aria-label="Select all" indeterminate />);
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;

    expect(checkbox.indeterminate).toBe(true);
    expect(checkbox).toHaveAttribute('data-indeterminate', 'true');
  });

  it('omits data-indeterminate and clears the indeterminate DOM property when not indeterminate', () => {
    render(<UnstyledCheckbox aria-label="Select all" />);
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;

    expect(checkbox.indeterminate).toBe(false);
    expect(checkbox).not.toHaveAttribute('data-indeterminate');
  });

  it('is focusable via Tab key', async () => {
    const user = userEvent.setup();
    render(<UnstyledCheckbox aria-label="Accept terms" />);

    await user.tab();

    expect(screen.getByRole('checkbox')).toHaveFocus();
  });

  it('sets data-focused on focus and clears it on blur', () => {
    render(<UnstyledCheckbox aria-label="Accept terms" />);
    const checkbox = screen.getByRole('checkbox');

    fireEvent.focus(checkbox);
    expect(checkbox).toHaveAttribute('data-focused', 'true');

    fireEvent.blur(checkbox);
    expect(checkbox).not.toHaveAttribute('data-focused');
  });

  it('sets data-disabled when disabled', () => {
    render(<UnstyledCheckbox aria-label="Accept terms" disabled />);

    expect(screen.getByRole('checkbox')).toHaveAttribute(
      'data-disabled',
      'true',
    );
  });

  it('is not toggleable when disabled', async () => {
    const user = userEvent.setup();
    render(
      <UnstyledCheckbox
        aria-label="Accept terms"
        disabled
        defaultChecked={false}
      />,
    );
    const checkbox = screen.getByRole('checkbox');

    await user.click(checkbox);

    expect(checkbox).not.toBeChecked();
  });

  it('sets data-invalid and aria-invalid when invalid', () => {
    render(<UnstyledCheckbox aria-label="Accept terms" invalid />);
    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).toHaveAttribute('data-invalid', 'true');
    expect(checkbox).toHaveAttribute('aria-invalid', 'true');
  });

  it('omits data-invalid and aria-invalid when not invalid', () => {
    render(<UnstyledCheckbox aria-label="Accept terms" />);
    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).not.toHaveAttribute('data-invalid');
    expect(checkbox).not.toHaveAttribute('aria-invalid');
  });

  it('forwards a ref to the underlying input element', () => {
    const ref = createRef<HTMLInputElement>();
    render(<UnstyledCheckbox aria-label="Accept terms" ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('passes through arbitrary native input attributes', () => {
    render(<UnstyledCheckbox aria-label="Accept terms" name="terms" />);

    expect(screen.getByRole('checkbox')).toHaveAttribute('name', 'terms');
  });

  it('still tracks data-focused even when the consumer passes their own onFocus', () => {
    const handleFocus = vi.fn();
    render(
      <UnstyledCheckbox aria-label="Accept terms" onFocus={handleFocus} />,
    );
    const checkbox = screen.getByRole('checkbox');

    fireEvent.focus(checkbox);

    expect(handleFocus).toHaveBeenCalled();
    expect(checkbox).toHaveAttribute('data-focused', 'true');
  });

  it('still tracks data-focused clearing even when the consumer passes their own onBlur', () => {
    const handleBlur = vi.fn();
    render(<UnstyledCheckbox aria-label="Accept terms" onBlur={handleBlur} />);
    const checkbox = screen.getByRole('checkbox');

    fireEvent.focus(checkbox);
    fireEvent.blur(checkbox);

    expect(handleBlur).toHaveBeenCalled();
    expect(checkbox).not.toHaveAttribute('data-focused');
  });
});
