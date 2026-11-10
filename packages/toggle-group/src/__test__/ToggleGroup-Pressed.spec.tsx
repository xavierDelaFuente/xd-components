import { render, screen } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import { useState } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  ToggleGroup,
  type ToggleGroupProps,
  ToggleGroupItem,
} from '../components';

type ModeProps = Partial<
  Pick<ToggleGroupProps, 'value' | 'defaultValue' | 'onValueChange'>
>;

function ModeGroup(props: ModeProps) {
  return (
    <ToggleGroup aria-label="Colour mode" {...props}>
      <ToggleGroupItem value="system">System</ToggleGroupItem>
      <ToggleGroupItem value="light">Light</ToggleGroupItem>
      <ToggleGroupItem value="dark">Dark</ToggleGroupItem>
    </ToggleGroup>
  );
}

function ControlledModeGroup({ initial }: { initial: string }) {
  const [value, setValue] = useState(initial);
  return <ModeGroup value={value} onValueChange={setValue} />;
}

const getItem = (name: string) => screen.getByRole('button', { name });

function expectPressed(pressed: string) {
  for (const name of ['System', 'Light', 'Dark']) {
    const isPressed = name === pressed;
    expect(getItem(name)).toHaveAttribute('aria-pressed', String(isPressed));
    expect(getItem(name)).toHaveAttribute(
      'data-variant',
      isPressed ? 'primary' : 'outline',
    );
  }
}

let user: UserEvent;

beforeEach(() => {
  user = userEvent.setup();
});

describe('ToggleGroup — pressed state', () => {
  it('renders every item unpressed (aria-pressed="false", outline) with no value', () => {
    render(<ModeGroup />);
    expectPressed('none');
  });

  it('marks the item matching value as pressed (aria-pressed="true", primary)', () => {
    render(<ModeGroup value="light" />);
    expectPressed('Light');
  });

  it('marks the item matching defaultValue as pressed', () => {
    render(<ModeGroup defaultValue="dark" />);
    expectPressed('Dark');
  });
});

describe('ToggleGroup — uncontrolled (defaultValue)', () => {
  it('moves the pressed state to the clicked item', async () => {
    render(<ModeGroup defaultValue="system" />);
    await user.click(getItem('Dark'));
    expectPressed('Dark');
  });

  it('calls onValueChange with the clicked value', async () => {
    const onValueChange = vi.fn();
    render(<ModeGroup defaultValue="system" onValueChange={onValueChange} />);
    await user.click(getItem('Light'));
    expect(onValueChange).toHaveBeenCalledOnce();
    expect(onValueChange).toHaveBeenCalledWith('light');
  });

  it('keeps the pressed item pressed when it is clicked again (single-select, no deselect)', async () => {
    const onValueChange = vi.fn();
    render(<ModeGroup defaultValue="light" onValueChange={onValueChange} />);
    await user.click(getItem('Light'));
    expectPressed('Light');
    expect(onValueChange).not.toHaveBeenCalled();
  });
});

describe('ToggleGroup — controlled (value + onValueChange)', () => {
  it('follows the value the parent stores', async () => {
    render(<ControlledModeGroup initial="system" />);
    await user.click(getItem('Light'));
    expectPressed('Light');
  });

  it('reports the click but does not move the pressed state on its own', async () => {
    const onValueChange = vi.fn();
    render(<ModeGroup value="system" onValueChange={onValueChange} />);
    await user.click(getItem('Dark'));
    expect(onValueChange).toHaveBeenCalledOnce();
    expect(onValueChange).toHaveBeenCalledWith('dark');
    expectPressed('System');
  });

  it('follows a new value from props', () => {
    const { rerender } = render(<ModeGroup value="system" />);
    rerender(<ModeGroup value="dark" />);
    expectPressed('Dark');
  });
});

describe('ToggleGroup — server-driven (value, no onValueChange)', () => {
  it('shows the value it was given and leaves it alone on click (the server decides)', async () => {
    render(<ModeGroup value="dark" />);
    await user.click(getItem('Light'));
    expectPressed('Dark');
  });
});

describe('ToggleGroupItem — click handling', () => {
  it("still calls the item's own onClick", async () => {
    const onClick = vi.fn();
    render(
      <ToggleGroup aria-label="Colour mode" defaultValue="system">
        <ToggleGroupItem value="system">System</ToggleGroupItem>
        <ToggleGroupItem value="dark" onClick={onClick}>
          Dark
        </ToggleGroupItem>
      </ToggleGroup>,
    );
    await user.click(getItem('Dark'));
    expect(onClick).toHaveBeenCalledOnce();
    expect(getItem('Dark')).toHaveAttribute('aria-pressed', 'true');
  });
});
