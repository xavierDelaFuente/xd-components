import {
  UnstyledTextarea,
  type UnstyledTextareaProps,
} from '@asnewyla/unstyled-textarea';
import { type ForwardedRef, forwardRef, useId } from 'react';
import './Textarea.css';

export type TextareaProps = Omit<UnstyledTextareaProps, 'invalid'> & {
  label: string;
  error?: string;
};

function TextareaInner(
  { label, id, error, disabled, className, ...rest }: TextareaProps,
  ref: ForwardedRef<HTMLTextAreaElement>,
) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;
  const errorId = `${textareaId}-error`;

  return (
    <div className="xd-textarea">
      <label className="xd-textarea-label" htmlFor={textareaId}>
        {label}
      </label>
      <UnstyledTextarea
        id={textareaId}
        {...rest}
        invalid={!!error}
        disabled={disabled}
        aria-describedby={error ? errorId : undefined}
        className={
          className ? `xd-textarea-input ${className}` : 'xd-textarea-input'
        }
        ref={ref}
      />
      {error && (
        <div className="xd-textarea-error" id={errorId}>
          {error}
        </div>
      )}
    </div>
  );
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  TextareaInner,
);
