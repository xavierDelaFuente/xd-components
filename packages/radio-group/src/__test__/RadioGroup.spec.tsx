import { Radio } from '@asnewyla/radio';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { RadioGroup } from '../components';

describe('RadioGroup', () => {
  it('renders its children', () => {
    render(
      <RadioGroup name="size">
        <Radio label="Small" value="sm" />
      </RadioGroup>,
    );

    expect(screen.getByText('Small')).toBeInTheDocument();
  });

  it('renders with role="radiogroup"', () => {
    render(
      <RadioGroup name="size">
        <Radio label="Small" value="sm" />
      </RadioGroup>,
    );

    expect(screen.getByRole('radiogroup')).toBeInTheDocument();
  });

  it('is uncontrolled by default — defaultValue sets the initially selected radio', () => {
    render(
      <RadioGroup name="size" defaultValue="md">
        <Radio label="Small" value="sm" />
        <Radio label="Medium" value="md" />
        <Radio label="Large" value="lg" />
      </RadioGroup>,
    );

    expect(screen.getByRole('radio', { name: 'Medium' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Small' })).not.toBeChecked();
    expect(screen.getByRole('radio', { name: 'Large' })).not.toBeChecked();
  });

  it('clicking a different member radio moves the selection (uncontrolled) — the actual fix for the sibling-desync limitation documented in @asnewyla/unstyled-radio', async () => {
    const user = userEvent.setup();
    render(
      <RadioGroup name="size" defaultValue="sm">
        <Radio label="Small" value="sm" />
        <Radio label="Medium" value="md" />
        <Radio label="Large" value="lg" />
      </RadioGroup>,
    );

    await user.click(screen.getByRole('radio', { name: 'Medium' }));

    // Unlike two bare, independent UnstyledRadios sharing a name, the
    // group is one shared source of truth — clicking Medium re-renders
    // Small with checked=false from context, no stale attribute.
    expect(screen.getByRole('radio', { name: 'Medium' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Small' })).not.toBeChecked();
    expect(screen.getByRole('radio', { name: 'Large' })).not.toBeChecked();
  });

  it('supports controlled usage via value + onChange', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <RadioGroup name="size" value="sm" onChange={handleChange}>
        <Radio label="Small" value="sm" />
        <Radio label="Medium" value="md" />
      </RadioGroup>,
    );

    await user.click(screen.getByRole('radio', { name: 'Medium' }));

    expect(handleChange).toHaveBeenCalledWith('md');
    // still "sm" — nothing updated the value prop, matching how every
    // other controlled component in this codebase behaves
    expect(screen.getByRole('radio', { name: 'Small' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Medium' })).not.toBeChecked();
  });

  it('gives every member radio the same native name', () => {
    render(
      <RadioGroup name="size">
        <Radio label="Small" value="sm" />
        <Radio label="Medium" value="md" />
      </RadioGroup>,
    );

    expect(screen.getByRole('radio', { name: 'Small' })).toHaveAttribute(
      'name',
      'size',
    );
    expect(screen.getByRole('radio', { name: 'Medium' })).toHaveAttribute(
      'name',
      'size',
    );
  });

  it('forwards a ref to the wrapping element', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <RadioGroup name="size" ref={ref}>
        <Radio label="Small" value="sm" />
      </RadioGroup>,
    );

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('passes through arbitrary native div attributes', () => {
    render(
      <RadioGroup name="size" aria-label="Shirt size">
        <Radio label="Small" value="sm" />
      </RadioGroup>,
    );

    expect(screen.getByRole('radiogroup')).toHaveAttribute(
      'aria-label',
      'Shirt size',
    );
  });
});
