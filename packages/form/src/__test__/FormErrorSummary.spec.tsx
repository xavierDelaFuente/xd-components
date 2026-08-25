import { fireEvent, render, within } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Form, FormFieldInput } from '../components';
import {
  getErrorSummary,
  getFieldInput,
  queryErrorSummary,
  submitForm,
} from '../test-utils';

let user: UserEvent;

beforeEach(() => {
  user = userEvent.setup();
});

describe('Form error summary', () => {
  it('renders nothing when there are no errors', () => {
    render(
      <Form onSubmit={vi.fn()}>
        <FormFieldInput label="Email" name="email" required />
      </Form>,
    );

    expect(queryErrorSummary()).not.toBeInTheDocument();
  });

  it('does not appear from blur-driven validation alone, before any submit is attempted', async () => {
    render(
      <Form onSubmit={vi.fn()}>
        <FormFieldInput label="Email" name="email" required />
      </Form>,
    );

    await user.click(getFieldInput('Email'));
    await user.tab();

    expect(queryErrorSummary()).not.toBeInTheDocument();
  });

  it('appears with role="alert" once a submit fails', async () => {
    render(
      <Form onSubmit={vi.fn()}>
        <FormFieldInput label="Email" name="email" required />
        <button type="submit">Save</button>
      </Form>,
    );

    await submitForm(user);

    expect(getErrorSummary()).toBeInTheDocument();
  });

  it("lists one link per invalid field, each pointing at that field's real id", async () => {
    render(
      <Form onSubmit={vi.fn()}>
        <FormFieldInput label="Email" name="email" required />
        <FormFieldInput
          label="Password"
          name="password"
          required
          minLength={8}
        />
        <button type="submit">Save</button>
      </Form>,
    );

    await submitForm(user);

    const emailInput = getFieldInput('Email');
    const passwordInput = getFieldInput('Password');
    const links = within(getErrorSummary()).getAllByRole('link');

    expect(links).toHaveLength(2);
    expect(links.map((link) => link.getAttribute('href'))).toEqual(
      expect.arrayContaining([`#${emailInput.id}`, `#${passwordInput.id}`]),
    );
  });

  it("each link's text includes that field's error message", async () => {
    render(
      <Form onSubmit={vi.fn()}>
        <FormFieldInput label="Email" name="email" pattern="^\S+@\S+$" />
        <button type="submit">Save</button>
      </Form>,
    );

    await user.type(getFieldInput('Email'), 'not-an-email');
    await submitForm(user);

    expect(
      within(getErrorSummary()).getByText(/Invalid format/),
    ).toBeInTheDocument();
  });

  it('does not list a field that passed validation, only the ones that failed', async () => {
    render(
      <Form onSubmit={vi.fn()}>
        <FormFieldInput
          label="Email"
          name="email"
          required
          defaultValue="a@b.com"
        />
        <FormFieldInput
          label="Password"
          name="password"
          required
          defaultValue=""
        />
        <button type="submit">Save</button>
      </Form>,
    );

    await submitForm(user);

    expect(within(getErrorSummary()).getAllByRole('link')).toHaveLength(1);
  });

  it('moves focus to the summary itself after a failed submit', async () => {
    render(
      <Form onSubmit={vi.fn()}>
        <FormFieldInput label="Email" name="email" required />
        <button type="submit">Save</button>
      </Form>,
    );

    await submitForm(user);

    expect(document.activeElement).toBe(getErrorSummary());
  });

  it('moves focus back to the summary on a second failed submit attempt', async () => {
    render(
      <Form onSubmit={vi.fn()}>
        <FormFieldInput label="Email" name="email" required />
        <button type="submit">Save</button>
      </Form>,
    );

    await submitForm(user);
    await user.click(getFieldInput('Email'));
    await submitForm(user);

    expect(document.activeElement).toBe(getErrorSummary());
  });

  it('clicking a summary link moves focus to the corresponding field', async () => {
    render(
      <Form onSubmit={vi.fn()}>
        <FormFieldInput label="Email" name="email" required />
        <button type="submit">Save</button>
      </Form>,
    );

    await submitForm(user);
    const link = within(getErrorSummary()).getByRole('link');
    fireEvent.click(link);

    expect(document.activeElement).toBe(getFieldInput('Email'));
  });

  it('disappears once every field is corrected via blur, without needing to resubmit', async () => {
    render(
      <Form onSubmit={vi.fn()}>
        <FormFieldInput label="Email" name="email" required defaultValue="" />
        <button type="submit">Save</button>
      </Form>,
    );

    await submitForm(user);
    expect(getErrorSummary()).toBeInTheDocument();

    await user.type(getFieldInput('Email'), 'a@b.com');
    await user.tab();

    expect(queryErrorSummary()).not.toBeInTheDocument();
  });

  it('stays in sync (fewer links) as individual fields are corrected via blur after a failed submit', async () => {
    render(
      <Form onSubmit={vi.fn()}>
        <FormFieldInput label="Email" name="email" required defaultValue="" />
        <FormFieldInput
          label="Password"
          name="password"
          required
          defaultValue=""
        />
        <button type="submit">Save</button>
      </Form>,
    );

    await submitForm(user);
    expect(within(getErrorSummary()).getAllByRole('link')).toHaveLength(2);

    await user.type(getFieldInput('Email'), 'a@b.com');
    await user.tab();

    expect(within(getErrorSummary()).getAllByRole('link')).toHaveLength(1);
  });

  it("shows both the field's own inline error and its summary entry at the same time, not either", async () => {
    render(
      <Form onSubmit={vi.fn()}>
        <FormFieldInput label="Email" name="email" required />
        <button type="submit">Save</button>
      </Form>,
    );

    await submitForm(user);

    const input = getFieldInput('Email');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('This field is required');
    expect(
      within(getErrorSummary()).getByText('This field is required'),
    ).toBeInTheDocument();
  });
});
