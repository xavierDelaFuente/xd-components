import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { ToggleGroup, ToggleGroupItem } from '../components';

function ModeGroup(props: Partial<React.ComponentProps<typeof ToggleGroup>>) {
  return (
    <ToggleGroup aria-label="Colour mode" {...props}>
      <ToggleGroupItem value="system">System</ToggleGroupItem>
      <ToggleGroupItem value="light">Light</ToggleGroupItem>
      <ToggleGroupItem value="dark">Dark</ToggleGroupItem>
    </ToggleGroup>
  );
}

const getItem = (name: string) => screen.getByRole('button', { name });

describe('ToggleGroup — structure and accessible name', () => {
  it('renders a group named by aria-label', () => {
    render(<ModeGroup />);
    expect(
      screen.getByRole('group', { name: 'Colour mode' }),
    ).toBeInTheDocument();
  });

  it('renders a group named by aria-labelledby', () => {
    render(
      <>
        <span id="mode-label">Theme</span>
        <ToggleGroup aria-labelledby="mode-label">
          <ToggleGroupItem value="light">Light</ToggleGroupItem>
        </ToggleGroup>
      </>,
    );
    expect(screen.getByRole('group', { name: 'Theme' })).toBeInTheDocument();
  });

  it('requires an accessible name and an item value at the type level', () => {
    const unnamed = (
      // @ts-expect-error: a group needs aria-label or aria-labelledby
      <ToggleGroup>
        <ToggleGroupItem value="light">Light</ToggleGroupItem>
      </ToggleGroup>
    );
    // @ts-expect-error: an item needs a value
    const valueless = <ToggleGroupItem>Light</ToggleGroupItem>;
    expect(unnamed).toBeTruthy();
    expect(valueless).toBeTruthy();
  });

  it('renders each item as a real <button> named by its content', () => {
    render(<ModeGroup />);
    for (const name of ['System', 'Light', 'Dark']) {
      expect(getItem(name).tagName).toBe('BUTTON');
    }
  });

  it('passes native attributes through on the group', () => {
    render(<ModeGroup id="mode" />);
    expect(screen.getByRole('group')).toHaveAttribute('id', 'mode');
  });

  it('has the xd-toggle-group class, with a clean class attribute when no className is given', () => {
    render(<ModeGroup />);
    expect(screen.getByRole('group')).toHaveAttribute(
      'class',
      'xd-toggle-group',
    );
  });

  it('merges a consumer className with xd-toggle-group', () => {
    render(<ModeGroup className="settings-mode" />);
    expect(screen.getByRole('group')).toHaveAttribute(
      'class',
      'xd-toggle-group settings-mode',
    );
  });

  it('forwards ref to the group element', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <ToggleGroup ref={ref} aria-label="Colour mode">
        <ToggleGroupItem value="light">Light</ToggleGroupItem>
      </ToggleGroup>,
    );
    expect(ref.current).toBe(screen.getByRole('group'));
  });
});

describe('ToggleGroupItem — native button props', () => {
  it('defaults to type="button", so an item never submits by accident', () => {
    render(<ModeGroup />);
    expect(getItem('Light')).toHaveAttribute('type', 'button');
  });

  it('accepts type="submit" and formAction', () => {
    render(
      <ToggleGroup aria-label="Colour mode">
        <ToggleGroupItem value="light" type="submit" formAction="/mode">
          Light
        </ToggleGroupItem>
      </ToggleGroup>,
    );
    const item = getItem('Light');
    expect(item).toHaveAttribute('type', 'submit');
    expect(item).toHaveAttribute('formaction', '/mode');
  });

  it('puts its value on the native value attribute', () => {
    render(<ModeGroup />);
    expect(getItem('Dark')).toHaveAttribute('value', 'dark');
  });

  it('takes its name from the group', () => {
    render(<ModeGroup name="mode" />);
    for (const name of ['System', 'Light', 'Dark']) {
      expect(getItem(name)).toHaveAttribute('name', 'mode');
    }
  });

  it('has no name attribute when the group has none', () => {
    render(<ModeGroup />);
    expect(getItem('Light')).not.toHaveAttribute('name');
  });

  it('forwards ref to the <button>', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <ToggleGroup aria-label="Colour mode">
        <ToggleGroupItem ref={ref} value="light">
          Light
        </ToggleGroupItem>
      </ToggleGroup>,
    );
    expect(ref.current).toBe(getItem('Light'));
  });
});

describe('ToggleGroup — size and disabled', () => {
  it('sizes items md by default, like Button', () => {
    render(<ModeGroup />);
    expect(getItem('Light')).toHaveAttribute('data-size', 'md');
  });

  it.each(['sm', 'md', 'lg'] as const)(
    'propagates size="%s" to every item',
    (size) => {
      render(<ModeGroup size={size} />);
      for (const name of ['System', 'Light', 'Dark']) {
        expect(getItem(name)).toHaveAttribute('data-size', size);
      }
    },
  );

  it('disables every item when the group is disabled', () => {
    render(<ModeGroup disabled />);
    for (const name of ['System', 'Light', 'Dark']) {
      expect(getItem(name)).toBeDisabled();
    }
  });

  it('lets a single item be disabled on its own', () => {
    render(
      <ToggleGroup aria-label="Colour mode">
        <ToggleGroupItem value="light">Light</ToggleGroupItem>
        <ToggleGroupItem value="dark" disabled>
          Dark
        </ToggleGroupItem>
      </ToggleGroup>,
    );
    expect(getItem('Light')).toBeEnabled();
    expect(getItem('Dark')).toBeDisabled();
  });
});
