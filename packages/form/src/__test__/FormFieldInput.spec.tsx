import { type FormFieldContextValue, FormFieldProvider } from '@asnewyla/input';
import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FormFieldInput } from '../components';

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

describe('FormFieldInput', () => {
  it('renders as a normal Input when there is no FormFieldProvider ancestor', () => {
    render(<FormFieldInput label="Name" name="name" />);

    expect(screen.getByRole('textbox', { name: 'Name' })).toBeInTheDocument();
  });

  it('registers itself on mount when inside a FormFieldProvider', () => {
    render(
      <FormFieldProvider value={contextValue}>
        <FormFieldInput label="Email" name="email" />
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
        <FormFieldInput label="Email" name="email" />
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
        <FormFieldInput label="Email" name="email" ref={ref} />
      </FormFieldProvider>,
    );

    expect(ref.current).toBe(screen.getByRole('textbox', { name: 'Email' }));
  });

  it('bundles the validation-rule props into the registration', () => {
    const validate = () => undefined;
    render(
      <FormFieldProvider value={contextValue}>
        <FormFieldInput
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
        <FormFieldInput label="Email" name="email" />
      </FormFieldProvider>,
    );

    unmount();

    expect(contextValue.unregisterField).toHaveBeenCalledWith('email');
  });

  it('calls validateField(name) on blur', () => {
    render(
      <FormFieldProvider value={contextValue}>
        <FormFieldInput label="Email" name="email" />
      </FormFieldProvider>,
    );

    fireEvent.blur(screen.getByRole('textbox', { name: 'Email' }));

    expect(contextValue.validateField).toHaveBeenCalledWith('email');
  });

  it("still calls the consumer's own onBlur alongside the context's validateField", () => {
    const handleBlur = vi.fn();
    render(
      <FormFieldProvider value={contextValue}>
        <FormFieldInput label="Email" name="email" onBlur={handleBlur} />
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
        <FormFieldInput label="Email" name="email" />
      </FormFieldProvider>,
    );

    expect(screen.getByText('Enter a valid email address')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveAttribute(
      'aria-invalid',
      'true',
    );
  });

  it('prefers a local error prop over context.errors[name] when both are present', () => {
    contextValue.errors = { email: 'Context error loses' };
    render(
      <FormFieldProvider value={contextValue}>
        <FormFieldInput label="Email" name="email" error="Local error wins" />
      </FormFieldProvider>,
    );

    expect(screen.getByText('Local error wins')).toBeInTheDocument();
    expect(screen.queryByText('Context error loses')).not.toBeInTheDocument();
  });

  it('outside a Form, native HTML validation attributes still reach the underlying input', () => {
    render(
      <FormFieldInput
        label="Email"
        name="email"
        required
        pattern="^\S+@\S+$"
        minLength={5}
      />,
    );

    const input = screen.getByRole('textbox', { name: 'Email' });
    expect(input).toHaveAttribute('required');
    expect(input).toHaveAttribute('pattern', '^\\S+@\\S+$');
    expect(input).toHaveAttribute('minLength', '5');
  });

  it('outside a Form, blur does not throw and does not mark the field invalid on its own', () => {
    render(<FormFieldInput label="Email" name="email" required />);
    const input = screen.getByRole('textbox', { name: 'Email' });

    expect(() => fireEvent.blur(input)).not.toThrow();
    expect(input).not.toHaveAttribute('aria-invalid');
  });

  it('re-registers under the new name when the name prop changes, unregistering the old one', () => {
    const { rerender } = render(
      <FormFieldProvider value={contextValue}>
        <FormFieldInput label="Field" name="first" />
      </FormFieldProvider>,
    );

    expect(contextValue.registerField).toHaveBeenCalledWith(
      'first',
      expect.anything(),
    );

    rerender(
      <FormFieldProvider value={contextValue}>
        <FormFieldInput label="Field" name="second" />
      </FormFieldProvider>,
    );

    expect(contextValue.unregisterField).toHaveBeenCalledWith('first');
    expect(contextValue.registerField).toHaveBeenCalledWith(
      'second',
      expect.anything(),
    );
  });

  it('supports a ref callback function, in addition to a ref object', () => {
    let receivedNode: HTMLInputElement | null = null;
    render(
      <FormFieldInput
        label="Email"
        name="email"
        ref={(node) => {
          receivedNode = node;
        }}
      />,
    );

    expect(receivedNode).toBe(screen.getByRole('textbox', { name: 'Email' }));
  });
});
