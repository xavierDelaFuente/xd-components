import { fireEvent, render } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import { createRef } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UnstyledSwitch } from '../components';
import { getSwitch } from '../test-utils';

let user: UserEvent;

beforeEach(() => {
  user = userEvent.setup();
});

describe('UnstyledSwitch', () => {
  it('renders a switch', () => {
    render(<UnstyledSwitch aria-label="Notifications" />);

    expect(getSwitch()).toBeInTheDocument();
  });

  it('renders on a real checkbox input, regardless of any type override — role="switch" is the only ARIA-visible difference from a checkbox', () => {
    render(<UnstyledSwitch aria-label="Notifications" />);

    expect(getSwitch()).toHaveAttribute('type', 'checkbox');
  });

  it('is uncontrolled by default — starts at defaultChecked and toggles on click', async () => {
    render(
      <UnstyledSwitch aria-label="Notifications" defaultChecked={false} />,
    );
    const toggle = getSwitch();

    expect(toggle).not.toBeChecked();
    await user.click(toggle);
    expect(toggle).toBeChecked();
  });

  it('supports controlled usage via checked + onChange', async () => {
    const handleChange = vi.fn();
    render(
      <UnstyledSwitch
        aria-label="Notifications"
        checked={false}
        onChange={handleChange}
      />,
    );
    const toggle = getSwitch();

    expect(toggle).not.toBeChecked();
    await user.click(toggle);
    expect(handleChange).toHaveBeenCalled();
    // still unchecked — nothing updated the checked prop, matching how a
    // controlled native input works
    expect(toggle).not.toBeChecked();
  });

  it('calls onChange with the actual checked value in the event', async () => {
    let checkedValue: boolean | undefined;
    const handleChange = vi.fn((e: React.ChangeEvent<HTMLInputElement>) => {
      checkedValue = e.target.checked;
    });
    render(
      <UnstyledSwitch
        aria-label="Notifications"
        checked={false}
        onChange={handleChange}
      />,
    );

    await user.click(getSwitch());

    expect(checkedValue).toBe(true);
  });

  it('calls a consumer-provided onChange even in uncontrolled mode', async () => {
    const handleChange = vi.fn();
    render(
      <UnstyledSwitch
        aria-label="Notifications"
        defaultChecked={false}
        onChange={handleChange}
      />,
    );

    await user.click(getSwitch());

    expect(handleChange).toHaveBeenCalled();
  });

  it('sets data-checked to true when checked and removes it when unchecked (uncontrolled)', async () => {
    render(
      <UnstyledSwitch aria-label="Notifications" defaultChecked={false} />,
    );
    const toggle = getSwitch();

    expect(toggle).not.toHaveAttribute('data-checked');
    await user.click(toggle);
    expect(toggle).toHaveAttribute('data-checked', 'true');
    await user.click(toggle);
    expect(toggle).not.toHaveAttribute('data-checked');
  });

  it('reflects data-checked from the checked prop when controlled', () => {
    render(
      <UnstyledSwitch aria-label="Notifications" checked onChange={() => {}} />,
    );

    expect(getSwitch()).toHaveAttribute('data-checked', 'true');
  });

  it('exposes aria-checked mirroring the checked state, for the role="switch" override', async () => {
    render(
      <UnstyledSwitch aria-label="Notifications" defaultChecked={false} />,
    );
    const toggle = getSwitch();

    expect(toggle).toHaveAttribute('aria-checked', 'false');
    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-checked', 'true');
  });

  it('is focusable via Tab key', async () => {
    render(<UnstyledSwitch aria-label="Notifications" />);

    await user.tab();

    expect(getSwitch()).toHaveFocus();
  });

  it('sets data-focused on focus and clears it on blur', () => {
    render(<UnstyledSwitch aria-label="Notifications" />);
    const toggle = getSwitch();

    fireEvent.focus(toggle);
    expect(toggle).toHaveAttribute('data-focused', 'true');

    fireEvent.blur(toggle);
    expect(toggle).not.toHaveAttribute('data-focused');
  });

  it('sets data-disabled when disabled', () => {
    render(<UnstyledSwitch aria-label="Notifications" disabled />);

    expect(getSwitch()).toHaveAttribute('data-disabled', 'true');
  });

  it('is not toggleable when disabled', async () => {
    render(
      <UnstyledSwitch
        aria-label="Notifications"
        disabled
        defaultChecked={false}
      />,
    );
    const toggle = getSwitch();

    await user.click(toggle);

    expect(toggle).not.toBeChecked();
  });

  it('sets data-invalid and aria-invalid when invalid', () => {
    render(<UnstyledSwitch aria-label="Notifications" invalid />);
    const toggle = getSwitch();

    expect(toggle).toHaveAttribute('data-invalid', 'true');
    expect(toggle).toHaveAttribute('aria-invalid', 'true');
  });

  it('omits data-invalid and aria-invalid when not invalid', () => {
    render(<UnstyledSwitch aria-label="Notifications" />);
    const toggle = getSwitch();

    expect(toggle).not.toHaveAttribute('data-invalid');
    expect(toggle).not.toHaveAttribute('aria-invalid');
  });

  it('forwards a ref to the underlying input element', () => {
    const ref = createRef<HTMLInputElement>();
    render(<UnstyledSwitch aria-label="Notifications" ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('passes through arbitrary native input attributes', () => {
    render(<UnstyledSwitch aria-label="Notifications" name="notifications" />);

    expect(getSwitch()).toHaveAttribute('name', 'notifications');
  });

  it('still tracks data-focused even when the consumer passes their own onFocus', () => {
    const handleFocus = vi.fn();
    render(<UnstyledSwitch aria-label="Notifications" onFocus={handleFocus} />);
    const toggle = getSwitch();

    fireEvent.focus(toggle);

    expect(handleFocus).toHaveBeenCalled();
    expect(toggle).toHaveAttribute('data-focused', 'true');
  });

  it('still tracks data-focused clearing even when the consumer passes their own onBlur', () => {
    const handleBlur = vi.fn();
    render(<UnstyledSwitch aria-label="Notifications" onBlur={handleBlur} />);
    const toggle = getSwitch();

    fireEvent.focus(toggle);
    fireEvent.blur(toggle);

    expect(handleBlur).toHaveBeenCalled();
    expect(toggle).not.toHaveAttribute('data-focused');
  });
});
