import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Alert } from '../components';

describe('Alert — content', () => {
  it('renders its children', () => {
    render(<Alert>Your password is changed.</Alert>);
    expect(screen.getByText('Your password is changed.')).toBeInTheDocument();
  });

  it('renders an optional title before the message', () => {
    render(
      <Alert tone="error" title="Sign-in failed">
        Wrong email or password.
      </Alert>,
    );
    const alert = screen.getByRole('alert');
    const title = screen.getByText('Sign-in failed');
    expect(title).toHaveClass('xd-alert-title');
    expect(alert.firstElementChild).toBe(title);
    expect(alert).toHaveTextContent('Sign-in failedWrong email or password.');
  });

  it('renders no title element when no title is given', () => {
    const { container } = render(<Alert>Saved.</Alert>);
    expect(container.querySelector('.xd-alert-title')).toBeNull();
  });

  it('allows inline content such as links in the message', () => {
    render(
      <Alert tone="info">
        Import finished. <a href="/imports/42">See the summary</a>.
      </Alert>,
    );
    expect(
      screen.getByRole('link', { name: 'See the summary' }),
    ).toHaveAttribute('href', '/imports/42');
  });
});

describe('Alert — tone', () => {
  it('defaults to the info tone', () => {
    render(<Alert>Heads up.</Alert>);
    expect(screen.getByRole('status')).toHaveAttribute('data-tone', 'info');
  });

  it.each(['error', 'success', 'info', 'warning'] as const)(
    'sets data-tone="%s"',
    (tone) => {
      const { container } = render(<Alert tone={tone}>Message</Alert>);
      expect(container.firstElementChild).toHaveAttribute('data-tone', tone);
    },
  );

  it('rejects an unknown tone at the type level', () => {
    // @ts-expect-error: not one of error | success | info | warning
    const element = <Alert tone="danger">Message</Alert>;
    expect(element).toBeTruthy();
  });
});

describe('Alert — role and announcement', () => {
  it('uses role="alert" for the error tone', () => {
    render(<Alert tone="error">Wrong email or password.</Alert>);
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Wrong email or password.',
    );
  });

  it.each(['success', 'info', 'warning'] as const)(
    'uses role="status" for the %s tone',
    (tone) => {
      render(<Alert tone={tone}>Message</Alert>);
      expect(screen.getByRole('status')).toHaveTextContent('Message');
      expect(screen.queryByRole('alert')).toBeNull();
    },
  );

  it('lets role be overridden', () => {
    render(
      <Alert tone="success" role="alert">
        Saved.
      </Alert>,
    );
    expect(screen.getByRole('alert')).toHaveAttribute('data-tone', 'success');
  });

  it('renders no role with announce={false}, for static text', () => {
    const { container } = render(
      <Alert tone="error" announce={false}>
        This account is locked.
      </Alert>,
    );
    expect(container.firstElementChild).not.toHaveAttribute('role');
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('lets announce={false} win over an explicit role', () => {
    const { container } = render(
      <Alert tone="info" role="status" announce={false}>
        Read-only.
      </Alert>,
    );
    expect(container.firstElementChild).not.toHaveAttribute('role');
  });
});

describe('Alert — element and native props', () => {
  it('renders a <div> with the xd-alert class, with a clean class attribute when no className is given', () => {
    const { container } = render(<Alert>Message</Alert>);
    const alert = container.firstElementChild;
    expect(alert?.tagName).toBe('DIV');
    expect(alert).toHaveAttribute('class', 'xd-alert');
  });

  it('merges a consumer className with xd-alert', () => {
    const { container } = render(<Alert className="form-error">Message</Alert>);
    expect(container.firstElementChild).toHaveAttribute(
      'class',
      'xd-alert form-error',
    );
  });

  it('passes native attributes through', () => {
    render(
      <Alert id="login-error" tone="error" aria-live="assertive">
        Wrong email or password.
      </Alert>,
    );
    const alert = screen.getByRole('alert');
    expect(alert).toHaveAttribute('id', 'login-error');
    expect(alert).toHaveAttribute('aria-live', 'assertive');
  });

  it('forwards ref to the <div>', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Alert ref={ref}>Message</Alert>);
    expect(ref.current).toBe(screen.getByRole('status'));
  });
});

describe('Alert — server rendering', () => {
  it('renders to static HTML with no client code (a server component)', () => {
    const html = renderToStaticMarkup(
      <Alert tone="error" title="Sign-in failed">
        Wrong email or password.
      </Alert>,
    );
    expect(html).toContain('role="alert"');
    expect(html).toContain('data-tone="error"');
    expect(html).toContain('Sign-in failed');
    expect(html).toContain('Wrong email or password.');
  });
});
