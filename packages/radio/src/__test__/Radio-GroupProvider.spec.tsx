import { render } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Radio, RadioGroupProvider } from '../components';
import { getRadio } from '../test-utils';

let user: UserEvent;

beforeEach(() => {
  user = userEvent.setup();
});

describe('Radio — inside a RadioGroupProvider', () => {
  it("is checked when its own value matches the group's value", () => {
    render(
      <RadioGroupProvider
        value={{ name: 'size', value: 'md', onChange: () => {} }}
      >
        <Radio label="Medium" value="md" />
      </RadioGroupProvider>,
    );

    expect(getRadio('Medium')).toBeChecked();
  });

  it("is not checked when its own value does not match the group's value", () => {
    render(
      <RadioGroupProvider
        value={{ name: 'size', value: 'md', onChange: () => {} }}
      >
        <Radio label="Large" value="lg" />
      </RadioGroupProvider>,
    );

    expect(getRadio('Large')).not.toBeChecked();
  });

  it("uses the group's name so member radios share native grouping", () => {
    render(
      <RadioGroupProvider
        value={{ name: 'size', value: 'md', onChange: () => {} }}
      >
        <Radio label="Large" value="lg" />
      </RadioGroupProvider>,
    );

    expect(getRadio('Large')).toHaveAttribute('name', 'size');
  });

  it('calls the group onChange with its own value when selected', async () => {
    const handleGroupChange = vi.fn();
    render(
      <RadioGroupProvider
        value={{ name: 'size', value: 'md', onChange: handleGroupChange }}
      >
        <Radio label="Large" value="lg" />
      </RadioGroupProvider>,
    );

    await user.click(getRadio('Large'));

    expect(handleGroupChange).toHaveBeenCalledWith('lg');
  });

  it('still calls its own onChange alongside the group onChange', async () => {
    const handleOwnChange = vi.fn();
    render(
      <RadioGroupProvider
        value={{ name: 'size', value: 'md', onChange: () => {} }}
      >
        <Radio label="Large" value="lg" onChange={handleOwnChange} />
      </RadioGroupProvider>,
    );

    await user.click(getRadio('Large'));

    expect(handleOwnChange).toHaveBeenCalled();
  });

  it('lets an explicit own checked prop override the group', () => {
    render(
      <RadioGroupProvider
        value={{ name: 'size', value: 'md', onChange: () => {} }}
      >
        <Radio label="Large" value="lg" checked />
      </RadioGroupProvider>,
    );

    // group.value ("md") does not match "lg", but the explicit checked
    // prop wins anyway — same prop ?? group?.x precedence Button already
    // uses for ButtonGroupContext.
    expect(getRadio('Large')).toBeChecked();
  });

  it('resolving two radios against the same group only checks the one whose value matches', () => {
    render(
      <RadioGroupProvider
        value={{ name: 'size', value: 'md', onChange: () => {} }}
      >
        <Radio label="Medium" value="md" />
        <Radio label="Large" value="lg" />
      </RadioGroupProvider>,
    );

    expect(getRadio('Medium')).toBeChecked();
    expect(getRadio('Large')).not.toBeChecked();
  });
});
