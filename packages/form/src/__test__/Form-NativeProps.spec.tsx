import { fireEvent, render, screen } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import { createRef } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Form, FormFieldInput } from '../components';
import { getErrorSummary, getFieldInput, submitForm } from '../test-utils';

const getForm = () => document.querySelector('form') as HTMLFormElement;

let user: UserEvent;

beforeEach(() => {
  user = userEvent.setup();
});

describe('Form — native <form> props', () => {
  it('forwards action, method and encType to the <form>', () => {
    render(
      <Form action="/login" method="post" encType="multipart/form-data">
        <FormFieldInput label="Email" name="email" />
      </Form>,
    );

    const form = getForm();
    expect(form).toHaveAttribute('action', '/login');
    expect(form).toHaveAttribute('method', 'post');
    expect(form).toHaveAttribute('enctype', 'multipart/form-data');
  });

  it('forwards aria-* and other native attributes', () => {
    render(
      <Form aria-label="Sign in" id="sign-in" className="auth-form">
        <FormFieldInput label="Email" name="email" />
      </Form>,
    );

    const form = screen.getByRole('form', { name: 'Sign in' });
    expect(form).toHaveAttribute('id', 'sign-in');
    expect(form).toHaveClass('auth-form');
  });

  it('forwards ref to the <form> element', () => {
    const ref = createRef<HTMLFormElement>();
    render(
      <Form ref={ref}>
        <FormFieldInput label="Email" name="email" />
      </Form>,
    );

    expect(ref.current).toBe(getForm());
  });

  it('still validates when a consumer ref is passed (the internal ref is not replaced)', async () => {
    const ref = createRef<HTMLFormElement>();
    render(
      <Form ref={ref} onSubmit={vi.fn()}>
        <FormFieldInput label="Name" name="name" required defaultValue="" />
        <button type="submit">Save</button>
      </Form>,
    );

    await submitForm(user);

    expect(getErrorSummary()).toHaveFocus();
  });

  it('keeps noValidate on by default', () => {
    render(
      <Form>
        <FormFieldInput label="Email" name="email" />
      </Form>,
    );

    expect(getForm()).toHaveAttribute('novalidate');
  });

  it('lets a consumer turn native validation back on with noValidate={false}', () => {
    render(
      <Form noValidate={false}>
        <FormFieldInput label="Email" name="email" />
      </Form>,
    );

    expect(getForm()).not.toHaveAttribute('novalidate');
  });
});

describe('Form — submitting with action', () => {
  // fireEvent.submit returns false when the event's default was prevented.
  // Not prevented = the native submit (or a React 19 form action) goes ahead.

  it('does not prevent a valid submit when action is given', () => {
    render(
      <Form action="/login">
        <FormFieldInput label="Email" name="email" defaultValue="a@b.com" />
      </Form>,
    );

    expect(fireEvent.submit(getForm())).toBe(true);
  });

  it('calls onSubmit with the values and still does not prevent the submit when both action and onSubmit are given', () => {
    const handleSubmit = vi.fn();
    render(
      <Form action="/login" onSubmit={handleSubmit}>
        <FormFieldInput label="Email" name="email" defaultValue="a@b.com" />
      </Form>,
    );

    expect(fireEvent.submit(getForm())).toBe(true);
    expect(handleSubmit).toHaveBeenCalledWith({ email: 'a@b.com' });
  });

  it('prevents an invalid submit even when action is given, and focuses the error summary', () => {
    const handleSubmit = vi.fn();
    render(
      <Form action="/login" onSubmit={handleSubmit}>
        <FormFieldInput label="Email" name="email" required defaultValue="" />
        <button type="submit">Save</button>
      </Form>,
    );

    expect(fireEvent.submit(getForm())).toBe(false);
    expect(handleSubmit).not.toHaveBeenCalled();
    expect(getErrorSummary()).toHaveFocus();
  });

  it('does not prevent a valid submit with neither action nor onSubmit (a plain no-JS form posts to the current URL)', () => {
    render(
      <Form method="post">
        <FormFieldInput label="Email" name="email" defaultValue="a@b.com" />
      </Form>,
    );

    expect(fireEvent.submit(getForm())).toBe(true);
  });

  it('still prevents a valid submit when only onSubmit is given (existing client-only behavior)', async () => {
    const handleSubmit = vi.fn();
    render(
      <Form onSubmit={handleSubmit}>
        <FormFieldInput label="Email" name="email" />
        <button type="submit">Save</button>
      </Form>,
    );

    await user.type(getFieldInput('Email'), 'a@b.com');

    expect(fireEvent.submit(getForm())).toBe(false);
    expect(handleSubmit).toHaveBeenCalledWith({ email: 'a@b.com' });
  });
});
