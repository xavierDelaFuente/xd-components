import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  type FormFieldContextValue,
  FormFieldProvider,
  Input,
} from '../components';

const contextValue: FormFieldContextValue = {
  registerField: vi.fn(),
  unregisterField: vi.fn(),
  validateField: vi.fn(),
  errors: {},
};

beforeEach(() => {
  vi.clearAllMocks();
  contextValue.errors = {};
});

describe('Input — Form field registration', () => {
  it('does not register when there is no FormFieldProvider ancestor', () => {
    render(<Input label="Name" name="name" />);

    expect(screen.getByRole('textbox', { name: 'Name' })).toBeInTheDocument();
  });

  it('does not register when no name prop is given, even inside a FormFieldProvider', () => {
    render(
      <FormFieldProvider value={contextValue}>
        <Input label="Name" />
      </FormFieldProvider>,
    );

    expect(contextValue.registerField).not.toHaveBeenCalled();
  });

  it('registers itself on mount when inside a FormFieldProvider with a name', () => {
    render(
      <FormFieldProvider value={contextValue}>
        <Input label="Email" name="email" />
      </FormFieldProvider>,
    );

    expect(contextValue.registerField).toHaveBeenCalledWith(
      'email',
      expect.objectContaining({ ref: expect.anything() }),
    );
  });

  it("the registered ref points at the actual underlying input's DOM node", () => {
    render(
      <FormFieldProvider value={contextValue}>
        <Input label="Email" name="email" />
      </FormFieldProvider>,
    );

    const [, registration] = (
      contextValue.registerField as ReturnType<typeof vi.fn>
    ).mock.calls[0];
    expect(registration.ref.current).toBe(
      screen.getByRole('textbox', { name: 'Email' }),
    );
  });

  it("a consumer's own forwarded ref still points at the same input, alongside registration", () => {
    const ref = createRef<HTMLInputElement>();
    render(
      <FormFieldProvider value={contextValue}>
        <Input label="Email" name="email" ref={ref} />
      </FormFieldProvider>,
    );

    expect(ref.current).toBe(screen.getByRole('textbox', { name: 'Email' }));
  });

  it('bundles the validation-rule props into the registration', () => {
    const validate = () => undefined;
    render(
      <FormFieldProvider value={contextValue}>
        <Input
          label="Password"
          name="password"
          required
          minLength={8}
          maxLength={64}
          validate={validate}
        />
      </FormFieldProvider>,
    );

    expect(contextValue.registerField).toHaveBeenCalledWith(
      'password',
      expect.objectContaining({
        rules: { required: true, minLength: 8, maxLength: 64, validate },
      }),
    );
  });

  it('unregisters on unmount', () => {
    const { unmount } = render(
      <FormFieldProvider value={contextValue}>
        <Input label="Email" name="email" />
      </FormFieldProvider>,
    );

    unmount();

    expect(contextValue.unregisterField).toHaveBeenCalledWith('email');
  });

  it('calls validateField(name) on blur', () => {
    render(
      <FormFieldProvider value={contextValue}>
        <Input label="Email" name="email" />
      </FormFieldProvider>,
    );

    fireEvent.blur(screen.getByRole('textbox', { name: 'Email' }));

    expect(contextValue.validateField).toHaveBeenCalledWith('email');
  });

  it("still calls the consumer's own onBlur alongside the context's validateField", () => {
    const handleBlur = vi.fn();
    render(
      <FormFieldProvider value={contextValue}>
        <Input label="Email" name="email" onBlur={handleBlur} />
      </FormFieldProvider>,
    );

    fireEvent.blur(screen.getByRole('textbox', { name: 'Email' }));

    expect(handleBlur).toHaveBeenCalled();
    expect(contextValue.validateField).toHaveBeenCalledWith('email');
  });

  it('displays the error from context.errors[name] when no local error prop is given', () => {
    contextValue.errors = { email: 'Enter a valid email address' };
    render(
      <FormFieldProvider value={contextValue}>
        <Input label="Email" name="email" />
      </FormFieldProvider>,
    );

    expect(
      screen.getByText('Enter a valid email address'),
    ).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveAttribute(
      'aria-invalid',
      'true',
    );
  });

  it('prefers a local error prop over context.errors[name] when both are present', () => {
    contextValue.errors = { email: 'Context error loses' };
    render(
      <FormFieldProvider value={contextValue}>
        <Input label="Email" name="email" error="Local error wins" />
      </FormFieldProvider>,
    );

    expect(screen.getByText('Local error wins')).toBeInTheDocument();
    expect(screen.queryByText('Context error loses')).not.toBeInTheDocument();
  });
});
