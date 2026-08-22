import { Input } from '@asnewyla/input';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type ChangeEvent, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Form, FormFieldInput } from '../components';

function ControlledEmailForm({
  onSubmit,
}: {
  onSubmit: (values: Record<string, string>) => void;
}) {
  const [value, setValue] = useState('');
  return (
    <Form onSubmit={onSubmit}>
      <FormFieldInput
        label="Email"
        name="email"
        required
        value={value}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          setValue(event.target.value)
        }
      />
      <button type="submit">Save</button>
    </Form>
  );
}

describe('Form', () => {
  it('renders a form element with its children', () => {
    render(
      <Form onSubmit={vi.fn()}>
        <FormFieldInput label="Email" name="email" />
      </Form>,
    );

    expect(screen.getByRole('textbox', { name: 'Email' })).toBeInTheDocument();
    expect(document.querySelector('form')).toBeInTheDocument();
  });

  it('calls onSubmit with the current field values when everything is valid', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(
      <Form onSubmit={handleSubmit}>
        <FormFieldInput label="Name" name="name" defaultValue="" />
        <button type="submit">Save</button>
      </Form>,
    );

    await user.type(screen.getByRole('textbox', { name: 'Name' }), 'Jordan');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(handleSubmit).toHaveBeenCalledWith({ name: 'Jordan' });
  });

  it('does not call onSubmit when a required field is empty', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(
      <Form onSubmit={handleSubmit}>
        <FormFieldInput label="Name" name="name" required defaultValue="" />
        <button type="submit">Save</button>
      </Form>,
    );

    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('does not let the native submit reload the page (preventDefault is called)', () => {
    render(
      <Form onSubmit={vi.fn()}>
        <FormFieldInput label="Name" name="name" />
        <button type="submit">Save</button>
      </Form>,
    );

    const form = document.querySelector('form') as HTMLFormElement;
    // fireEvent.X returns false when the event's default was prevented
    const notPrevented = fireEvent.submit(form);

    expect(notPrevented).toBe(false);
  });

  it('validates on blur — a required field left empty becomes invalid', async () => {
    const user = userEvent.setup();
    render(
      <Form onSubmit={vi.fn()}>
        <FormFieldInput label="Name" name="name" required defaultValue="" />
      </Form>,
    );
    const input = screen.getByRole('textbox', { name: 'Name' });

    await user.click(input);
    await user.tab();

    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('clears a field error once corrected and blurred again', async () => {
    const user = userEvent.setup();
    render(
      <Form onSubmit={vi.fn()}>
        <FormFieldInput label="Name" name="name" required defaultValue="" />
      </Form>,
    );
    const input = screen.getByRole('textbox', { name: 'Name' });

    await user.click(input);
    await user.tab();
    expect(input).toHaveAttribute('aria-invalid', 'true');

    await user.type(input, 'Jordan');
    await user.tab();

    expect(input).not.toHaveAttribute('aria-invalid');
  });

  it('validates on blur — a pattern mismatch becomes invalid and shows the message', async () => {
    const user = userEvent.setup();
    render(
      <Form onSubmit={vi.fn()}>
        <FormFieldInput label="Email" name="email" pattern="^\S+@\S+$" />
      </Form>,
    );
    const input = screen.getByRole('textbox', { name: 'Email' });

    await user.type(input, 'not-an-email');
    await user.tab();

    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Invalid format')).toBeInTheDocument();
  });

  it('validates on blur — a minLength violation becomes invalid', async () => {
    const user = userEvent.setup();
    render(
      <Form onSubmit={vi.fn()}>
        <FormFieldInput label="Password" name="password" minLength={8} />
      </Form>,
    );
    const input = screen.getByRole('textbox', { name: 'Password' });

    await user.type(input, 'short');
    await user.tab();

    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(
      screen.getByText('Must be at least 8 characters'),
    ).toBeInTheDocument();
  });

  it('the native maxLength attribute blocks typing past the limit', async () => {
    // Locks in the accepted behavior behind the next test: the native
    // `maxlength` attribute stops the browser (and userEvent.type, which
    // simulates real typing) from ever typing past the limit. A too-long
    // value can only reach the field via an initial value (defaultValue),
    // never by typing — this test is the contract for that constraint.
    const user = userEvent.setup();
    render(
      <Form onSubmit={vi.fn()}>
        <FormFieldInput label="Nickname" name="nickname" maxLength={3} />
      </Form>,
    );
    const input = screen.getByRole('textbox', {
      name: 'Nickname',
    }) as HTMLInputElement;

    await user.type(input, 'toolong');

    expect(input.value).toBe('too');
  });

  it('validates on blur — a maxLength violation becomes invalid', async () => {
    const user = userEvent.setup();
    render(
      <Form onSubmit={vi.fn()}>
        <FormFieldInput
          label="Nickname"
          name="nickname"
          maxLength={3}
          defaultValue="toolong"
        />
      </Form>,
    );
    const input = screen.getByRole('textbox', { name: 'Nickname' });

    await user.click(input);
    await user.tab();

    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(
      screen.getByText('Must be at most 3 characters'),
    ).toBeInTheDocument();
  });

  it('validates on blur — a min violation becomes invalid', async () => {
    const user = userEvent.setup();
    render(
      <Form onSubmit={vi.fn()}>
        <FormFieldInput label="Quantity" name="quantity" type="number" min={5} />
      </Form>,
    );
    const input = screen.getByRole('spinbutton', { name: 'Quantity' });

    await user.type(input, '3');
    await user.tab();

    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Must be at least 5')).toBeInTheDocument();
  });

  it('validates on blur — a max violation becomes invalid', async () => {
    const user = userEvent.setup();
    render(
      <Form onSubmit={vi.fn()}>
        <FormFieldInput label="Quantity" name="quantity" type="number" max={5} />
      </Form>,
    );
    const input = screen.getByRole('spinbutton', { name: 'Quantity' });

    await user.type(input, '10');
    await user.tab();

    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Must be at most 5')).toBeInTheDocument();
  });

  it('validates on blur — a custom validate function becomes invalid', async () => {
    const user = userEvent.setup();
    const validate = (value: string) =>
      value === 'admin' ? 'That username is reserved' : undefined;
    render(
      <Form onSubmit={vi.fn()}>
        <FormFieldInput label="Username" name="username" validate={validate} />
      </Form>,
    );
    const input = screen.getByRole('textbox', { name: 'Username' });

    await user.type(input, 'admin');
    await user.tab();

    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(
      screen.getByText('That username is reserved'),
    ).toBeInTheDocument();
  });

  it('does not call onSubmit when a non-required rule (pattern) fails on submit, not just on blur', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(
      <Form onSubmit={handleSubmit}>
        <FormFieldInput label="Email" name="email" pattern="^\S+@\S+$" />
        <button type="submit">Save</button>
      </Form>,
    );

    await user.type(
      screen.getByRole('textbox', { name: 'Email' }),
      'not-an-email',
    );
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('works with a controlled FormFieldInput (value + onChange), reading the live DOM value at validation time', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(<ControlledEmailForm onSubmit={handleSubmit} />);

    await user.type(screen.getByRole('textbox', { name: 'Email' }), 'a@b.com');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(handleSubmit).toHaveBeenCalledWith({ email: 'a@b.com' });
  });

  it('a plain Input (not FormFieldInput) inside a Form is never treated as a field', () => {
    render(
      <Form onSubmit={vi.fn()}>
        <Input label="Search" />
      </Form>,
    );

    expect(screen.getByRole('textbox', { name: 'Search' })).not.toHaveAttribute(
      'aria-invalid',
    );
  });

  it('a plain Input with a name is still collected into onSubmit via native FormData, even though it was never registered or validated — this is accepted, native <form> behavior, not something FormFieldInput needs to prevent', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(
      <Form onSubmit={handleSubmit}>
        <Input label="Search" name="search" defaultValue="" />
        <button type="submit">Save</button>
      </Form>,
    );

    await user.type(screen.getByRole('textbox', { name: 'Search' }), 'koi');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(handleSubmit).toHaveBeenCalledWith({ search: 'koi' });
  });
});
