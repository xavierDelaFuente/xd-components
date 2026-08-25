import { type ChangeEvent, createRef } from 'react';
import { fireEvent, render } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UnstyledRadio } from '../components';
import { getRadio } from '../test-utils';

let user: UserEvent;

beforeEach(() => {
  user = userEvent.setup();
});

describe('UnstyledRadio', () => {
  it('renders a radio', () => {
    render(<UnstyledRadio aria-label="Option A" />);

    expect(getRadio()).toBeInTheDocument();
  });

  it('always renders as a radio input, regardless of any type override', () => {
    render(<UnstyledRadio aria-label="Option A" />);

    expect(getRadio()).toHaveAttribute('type', 'radio');
  });

  it('is uncontrolled by default — starts unchecked and becomes checked on click', async () => {
    render(<UnstyledRadio aria-label="Option A" defaultChecked={false} />);
    const radio = getRadio();

    expect(radio).not.toBeChecked();
    await user.click(radio);
    expect(radio).toBeChecked();
  });

  it('supports controlled usage via checked + onChange', async () => {
    const handleChange = vi.fn();
    render(
      <UnstyledRadio
        aria-label="Option A"
        checked={false}
        onChange={handleChange}
      />,
    );
    const radio = getRadio();

    expect(radio).not.toBeChecked();
    await user.click(radio);
    expect(handleChange).toHaveBeenCalled();
    // still unchecked — nothing updated the checked prop, matching how a
    // controlled native input works
    expect(radio).not.toBeChecked();
  });

  it('calls onChange with the actual checked value in the event', async () => {
    let checkedValue: boolean | undefined;
    const handleChange = vi.fn((e: ChangeEvent<HTMLInputElement>) => {
      checkedValue = e.target.checked;
    });
    render(
      <UnstyledRadio
        aria-label="Option A"
        checked={false}
        onChange={handleChange}
      />,
    );

    await user.click(getRadio());

    expect(checkedValue).toBe(true);
  });

  it('calls a consumer-provided onChange even in uncontrolled mode', async () => {
    const handleChange = vi.fn();
    render(
      <UnstyledRadio
        aria-label="Option A"
        defaultChecked={false}
        onChange={handleChange}
      />,
    );

    await user.click(getRadio());

    expect(handleChange).toHaveBeenCalled();
  });

  it('sets data-checked to true once checked (uncontrolled)', async () => {
    render(<UnstyledRadio aria-label="Option A" defaultChecked={false} />);
    const radio = getRadio();

    expect(radio).not.toHaveAttribute('data-checked');
    await user.click(radio);
    expect(radio).toHaveAttribute('data-checked', 'true');
  });

  it('reflects data-checked from the checked prop when controlled', () => {
    render(<UnstyledRadio aria-label="Option A" checked onChange={() => {}} />);

    expect(getRadio()).toHaveAttribute('data-checked', 'true');
  });

  it(
    'documents an accepted limitation: data-checked on an uncontrolled ' +
      'radio does not clear when a sibling sharing name is checked instead ' +
      '— real multi-radio groups need RadioGroup, not several independent ' +
      'UnstyledRadios',
    async () => {
      render(
        <>
          <UnstyledRadio aria-label="Option A" name="choice" defaultChecked />
          <UnstyledRadio aria-label="Option B" name="choice" />
        </>,
      );
      const optionA = getRadio('Option A');
      const optionB = getRadio('Option B');

      expect(optionA).toHaveAttribute('data-checked', 'true');

      await user.click(optionB);

      // The DOM's own checked state is correct — native browser
      // radio-group exclusivity guarantees this regardless of React: no
      // two radios sharing a name can be checked at once.
      expect(optionA).not.toBeChecked();
      expect(optionB).toBeChecked();

      // But data-checked on optionA is stale: browsers never fire a
      // change event on a radio that gets deselected as a side effect of
      // a sibling being selected, so optionA's own internal tracking
      // never learns it was deselected. This is exactly why a real
      // multi-radio group needs a RadioGroup (one shared source of
      // truth), not several independent, uncontrolled UnstyledRadios.
      expect(optionA).toHaveAttribute('data-checked', 'true');
    },
  );

  it('is focusable via Tab key', async () => {
    render(<UnstyledRadio aria-label="Option A" />);

    await user.tab();

    expect(getRadio()).toHaveFocus();
  });

  it('sets data-focused on focus and clears it on blur', () => {
    render(<UnstyledRadio aria-label="Option A" />);
    const radio = getRadio();

    fireEvent.focus(radio);
    expect(radio).toHaveAttribute('data-focused', 'true');

    fireEvent.blur(radio);
    expect(radio).not.toHaveAttribute('data-focused');
  });

  it('sets data-disabled when disabled', () => {
    render(<UnstyledRadio aria-label="Option A" disabled />);

    expect(getRadio()).toHaveAttribute('data-disabled', 'true');
  });

  it('is not toggleable when disabled', async () => {
    render(
      <UnstyledRadio aria-label="Option A" disabled defaultChecked={false} />,
    );
    const radio = getRadio();

    await user.click(radio);

    expect(radio).not.toBeChecked();
  });

  it('sets data-invalid and aria-invalid when invalid', () => {
    render(<UnstyledRadio aria-label="Option A" invalid />);
    const radio = getRadio();

    expect(radio).toHaveAttribute('data-invalid', 'true');
    expect(radio).toHaveAttribute('aria-invalid', 'true');
  });

  it('omits data-invalid and aria-invalid when not invalid', () => {
    render(<UnstyledRadio aria-label="Option A" />);
    const radio = getRadio();

    expect(radio).not.toHaveAttribute('data-invalid');
    expect(radio).not.toHaveAttribute('aria-invalid');
  });

  it('forwards a ref to the underlying input element', () => {
    const ref = createRef<HTMLInputElement>();
    render(<UnstyledRadio aria-label="Option A" ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('passes through arbitrary native input attributes', () => {
    render(<UnstyledRadio aria-label="Option A" name="choice" value="a" />);

    const radio = getRadio();
    expect(radio).toHaveAttribute('name', 'choice');
    expect(radio).toHaveAttribute('value', 'a');
  });

  it('still tracks data-focused even when the consumer passes their own onFocus', () => {
    const handleFocus = vi.fn();
    render(<UnstyledRadio aria-label="Option A" onFocus={handleFocus} />);
    const radio = getRadio();

    fireEvent.focus(radio);

    expect(handleFocus).toHaveBeenCalled();
    expect(radio).toHaveAttribute('data-focused', 'true');
  });

  it('still tracks data-focused clearing even when the consumer passes their own onBlur', () => {
    const handleBlur = vi.fn();
    render(<UnstyledRadio aria-label="Option A" onBlur={handleBlur} />);
    const radio = getRadio();

    fireEvent.focus(radio);
    fireEvent.blur(radio);

    expect(handleBlur).toHaveBeenCalled();
    expect(radio).not.toHaveAttribute('data-focused');
  });
});
