import { UnstyledTextarea, type UnstyledTextareaProps } from '@asnewyla/unstyled-textarea';
import { ForwardedRef, forwardRef, useId } from 'react';

export type TextareaProps = UnstyledTextareaProps & {
  label: string;
  error?: string;
  className?: string;
};
function TextareaInner(
  { label, id, error, className, ...rest }: TextareaProps,
  ref: ForwardedRef<HTMLTextAreaElement>
) {
  const generatedId = id ?? useId()
  const errorId = `${generatedId}-error`

  return (
    <div>
      <UnstyledTextarea
        {...rest}
        id={generatedId}
        className={
          className ? `xd-textarea-input ${className}` : 'xd-textarea-input'
        }
        ref={ref}
        invalid={!!error}
        aria-describedby={error ? errorId : undefined}
      />
      <label htmlFor={generatedId} >
        {label}
      </label>
      {error && (
        <div id={errorId}>
          {error}
        </div>
      )}
    </div>
  )
}

export const Textarea = forwardRef(TextareaInner)