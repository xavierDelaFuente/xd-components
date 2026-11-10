import {
  type ComponentPropsWithoutRef,
  type ForwardedRef,
  forwardRef,
  type ReactNode,
} from 'react';
import './Alert.css';

export type AlertTone = 'error' | 'success' | 'info' | 'warning';

export type AlertProps = Omit<ComponentPropsWithoutRef<'div'>, 'title'> & {
  children: ReactNode;
  /** Sets the colours and the default role. */
  tone?: AlertTone;
  /** Optional heading line, shown before the message. */
  title?: ReactNode;
  /**
   * `false` renders no role at all, for static text that shouldn't be
   * announced. It wins over `role`.
   */
  announce?: boolean;
};

function AlertInner(
  {
    children,
    tone = 'info',
    title,
    announce = true,
    role,
    className,
    ...restProps
  }: AlertProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const defaultRole = tone === 'error' ? 'alert' : 'status';

  return (
    <div
      {...restProps}
      ref={ref}
      role={announce ? (role ?? defaultRole) : undefined}
      data-tone={tone}
      className={className ? `xd-alert ${className}` : 'xd-alert'}
    >
      {title && <p className="xd-alert-title">{title}</p>}
      <div className="xd-alert-body">{children}</div>
    </div>
  );
}

export const Alert = forwardRef(AlertInner);
