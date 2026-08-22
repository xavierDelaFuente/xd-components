import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Form, FormFieldInput } from '../components';


describe('Form error summary (not yet implemented — RED)', () => {
  it('renders nothing when there are no errors', () => {
    render(
      <Form onSubmit={vi.fn()}>
        <FormFieldInput label="Email" name="email" required />
      </Form>,
    );

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('does not appear from blur-driven validation alone, before any submit is attempted', async () => {
    const user = userEvent.setup();
    render(
      <Form onSubmit={vi.fn()}>
        <FormFieldInput label="Email" name="email" required />
      </Form>,
    );

    await user.click(screen.getByRole('textbox', { name: 'Email' }));
    await user.tab();

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('appears with role="alert" once a submit fails', async () => {
    const user = userEvent.setup();
    render(
      <Form onSubmit={vi.fn()}>
        <FormFieldInput label="Email" name="email" required />
        <button type="submit">Save</button>
      </Form>,
    );

    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it("lists one link per invalid field, each pointing at that field's real id", async () => {
    const user = userEvent.setup();
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

    await user.click(screen.getByRole('button', { name: 'Save' }));

    const emailInput = screen.getByRole('textbox', { name: 'Email' });
    const passwordInput = screen.getByRole('textbox', { name: 'Password' });
    const links = within(screen.getByRole('alert')).getAllByRole('link');

    expect(links).toHaveLength(2);
    expect(links.map((link) => link.getAttribute('href'))).toEqual(
      expect.arrayContaining([`#${emailInput.id}`, `#${passwordInput.id}`]),
    );
  });

  it("each link's text includes that field's error message", async () => {
    const user = userEvent.setup();
    render(
      <Form onSubmit={vi.fn()}>
        <FormFieldInput label="Email" name="email" pattern="^\S+@\S+$" />
        <button type="submit">Save</button>
      </Form>,
    );

    await user.type(
      screen.getByRole('textbox', { name: 'Email' }),
      'not-an-email',
    );
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(
      within(screen.getByRole('alert')).getByText(/Invalid format/),
    ).toBeInTheDocument();
  });

  it('does not list a field that passed validation, only the ones that failed', async () => {
    const user = userEvent.setup();
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

    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(
      within(screen.getByRole('alert')).getAllByRole('link'),
    ).toHaveLength(1);
  });

  it('moves focus to the summary itself after a failed submit', async () => {
    const user = userEvent.setup();
    render(
      <Form onSubmit={vi.fn()}>
        <FormFieldInput label="Email" name="email" required />
        <button type="submit">Save</button>
      </Form>,
    );

    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(document.activeElement).toBe(screen.getByRole('alert'));
  });

  it('moves focus back to the summary on a second failed submit attempt', async () => {
    const user = userEvent.setup();
    render(
      <Form onSubmit={vi.fn()}>
        <FormFieldInput label="Email" name="email" required />
        <button type="submit">Save</button>
      </Form>,
    );
    const saveButton = screen.getByRole('button', { name: 'Save' });

    await user.click(saveButton);
    await user.click(screen.getByRole('textbox', { name: 'Email' }));
    await user.click(saveButton);

    expect(document.activeElement).toBe(screen.getByRole('alert'));
  });

  it('clicking a summary link moves focus to the corresponding field', async () => {
    const user = userEvent.setup();
    render(
      <Form onSubmit={vi.fn()}>
        <FormFieldInput label="Email" name="email" required />
        <button type="submit">Save</button>
      </Form>,
    );

    await user.click(screen.getByRole('button', { name: 'Save' }));
    const link = within(screen.getByRole('alert')).getByRole('link');
    fireEvent.click(link);

    expect(document.activeElement).toBe(
      screen.getByRole('textbox', { name: 'Email' }),
    );
  });

  it('disappears once every field is corrected via blur, without needing to resubmit', async () => {
    const user = userEvent.setup();
    render(
      <Form onSubmit={vi.fn()}>
        <FormFieldInput
          label="Email"
          name="email"
          required
          defaultValue=""
        />
        <button type="submit">Save</button>
      </Form>,
    );

    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(screen.getByRole('alert')).toBeInTheDocument();

    await user.type(
      screen.getByRole('textbox', { name: 'Email' }),
      'a@b.com',
    );
    await user.tab();

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('stays in sync (fewer links) as individual fields are corrected via blur after a failed submit', async () => {
    const user = userEvent.setup();
    render(
      <Form onSubmit={vi.fn()}>
        <FormFieldInput
          label="Email"
          name="email"
          required
          defaultValue=""
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

    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(
      within(screen.getByRole('alert')).getAllByRole('link'),
    ).toHaveLength(2);

    await user.type(
      screen.getByRole('textbox', { name: 'Email' }),
      'a@b.com',
    );
    await user.tab();

    expect(
      within(screen.getByRole('alert')).getAllByRole('link'),
    ).toHaveLength(1);
  });
});
