import { getSwitch } from '@asnewyla/unstyled-switch/test-utils';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Switch } from '../components';

describe('Switch', () => {
  it('renders the label text', () => {
    render(<Switch label="Notifications" />);

    expect(screen.getByText('Notifications')).toBeInTheDocument();
  });

  it('associates the label with the input — clicking the label toggles it', async () => {
    const user = userEvent.setup();
    render(<Switch label="Notifications" defaultChecked={false} />);

    const toggle = getSwitch('Notifications');
    expect(toggle).not.toBeChecked();

    await user.click(screen.getByText('Notifications'));

    expect(toggle).toBeChecked();
  });

  it('auto-generates a unique id when none is provided', () => {
    render(
      <>
        <Switch label="Notifications" />
        <Switch label="Marketing emails" />
      </>,
    );

    const first = getSwitch('Notifications');
    const last = getSwitch('Marketing emails');

    expect(first.id).toBeTruthy();
    expect(last.id).toBeTruthy();
    expect(first.id).not.toBe(last.id);
  });

  it('respects an explicitly-provided id', () => {
    render(<Switch label="Notifications" id="custom-id" />);

    expect(getSwitch('Notifications')).toHaveAttribute('id', 'custom-id');
  });

  it('renders no error message when error is not provided', () => {
    render(<Switch label="Notifications" />);

    expect(screen.queryByRole('switch')).not.toHaveAttribute(
      'aria-describedby',
    );
  });

  it('renders the error message text when error is provided', () => {
    render(<Switch label="Notifications" error="Choose a notification setting" />);

    expect(
      screen.getByText('Choose a notification setting'),
    ).toBeInTheDocument();
  });

  it('links the input to the error message via aria-describedby', () => {
    render(<Switch label="Notifications" error="Choose a notification setting" />);

    const toggle = getSwitch('Notifications');
    const describedById = toggle.getAttribute('aria-describedby');

    expect(describedById).toBeTruthy();
    expect(document.getElementById(describedById as string)).toHaveTextContent(
      'Choose a notification setting',
    );
  });

  it('sets aria-invalid on the input when error is provided', () => {
    render(<Switch label="Notifications" error="Choose a notification setting" />);

    expect(getSwitch('Notifications')).toHaveAttribute('aria-invalid', 'true');
  });

  it('does not set aria-invalid when error is not provided', () => {
    render(<Switch label="Notifications" id="notifications" />);

    expect(getSwitch('Notifications')).not.toHaveAttribute('aria-invalid');
    expect(screen.queryByTestId('notifications-error')).not.toBeInTheDocument();
  });

  it('forwards disabled to the underlying input', () => {
    render(<Switch label="Notifications" disabled />);

    expect(getSwitch('Notifications')).toBeDisabled();
  });

  it('merges a consumer className with the base xd-switch-input class', () => {
    render(<Switch label="Notifications" className="my-switch" />);

    expect(getSwitch('Notifications')).toHaveClass(
      'xd-switch-input',
      'my-switch',
    );
  });

  it('forwards a ref to the underlying input element', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Switch label="Notifications" ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('passes through arbitrary native input attributes', () => {
    render(<Switch label="Notifications" name="notifications" />);

    expect(getSwitch('Notifications')).toHaveAttribute('name', 'notifications');
  });

  it('still sets data-focused on the underlying input when the consumer passes their own onFocus', () => {
    const handleFocus = vi.fn();
    render(<Switch label="Notifications" onFocus={handleFocus} />);

    const toggle = getSwitch('Notifications');
    fireEvent.focus(toggle);

    expect(handleFocus).toHaveBeenCalled();
    expect(toggle).toHaveAttribute('data-focused', 'true');
  });
});
