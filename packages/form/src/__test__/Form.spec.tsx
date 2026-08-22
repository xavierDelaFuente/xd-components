import { Input } from '@asnewyla/input';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Form, FormFieldInput } from '../components';

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
