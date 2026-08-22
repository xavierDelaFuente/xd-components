import { forwardRef } from 'react';
import type { InvalidField } from './useFieldRegistry';
import './FormErrorSummary.css';

export type FormErrorSummaryProps = {
  invalidFields: InvalidField[];
};

export const FormErrorSummary = forwardRef<
  HTMLDivElement,
  FormErrorSummaryProps
>(function FormErrorSummary({ invalidFields }, ref) {
  return (
    <div className="xd-form-error-summary" role="alert" tabIndex={-1} ref={ref}>
      <p className="xd-form-error-summary-heading">There is a problem</p>
      <ul>
        {invalidFields.map(({ name, id, message }) => (
          <li key={name}>
            <a
              href={`#${id}`}
              onClick={(event) => {
                event.preventDefault();
                document.getElementById(id)?.focus();
              }}
            >
              {message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
});
