import { screen } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { queryListbox } from '../test-utils';
import { renderSelect } from './fixtures';

let user: UserEvent;

beforeEach(() => {
  user = userEvent.setup();
});

describe('UnstyledSelect — renderValue', () => {
  it('uses renderValue instead of the default text when provided', () => {
    renderSelect({
      defaultValue: 'banana',
      renderValue: (selectedOptions) => (
        <span data-testid="custom-value">
          {selectedOptions.map((option) => option.label).join(' + ')}
        </span>
      ),
    });

    expect(screen.getByTestId('custom-value')).toHaveTextContent('Banana');
  });

  it('passes the current selection as SelectOption objects, not just values', () => {
    renderSelect({
      multiple: true,
      defaultValue: ['apple', 'cherry'],
      renderValue: (selectedOptions) => (
        <span data-testid="custom-value">
          {selectedOptions.map((option) => option.value).join(',')}
        </span>
      ),
    });

    expect(screen.getByTestId('custom-value')).toHaveTextContent(
      'apple,cherry',
    );
  });

  it('removeOption deselects the given option and calls onChange with the updated array', async () => {
    const handleChange = vi.fn();
    renderSelect({
      multiple: true,
      defaultValue: ['apple', 'banana'],
      onChange: handleChange,
      renderValue: (selectedOptions, { removeOption }) => (
        <div>
          {selectedOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeOption(option);
              }}
            >
              Remove {option.label}
            </button>
          ))}
        </div>
      ),
    });

    await user.click(screen.getByRole('button', { name: 'Remove Apple' }));

    expect(handleChange).toHaveBeenCalledWith(['banana']);
  });

  it("removeOption's click does not also toggle the listbox open (event does not bubble to the trigger)", async () => {
    renderSelect({
      multiple: true,
      defaultValue: ['apple'],
      renderValue: (selectedOptions, { removeOption }) => (
        <div>
          {selectedOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeOption(option);
              }}
            >
              Remove {option.label}
            </button>
          ))}
        </div>
      ),
    });

    await user.click(screen.getByRole('button', { name: 'Remove Apple' }));

    expect(queryListbox()).not.toBeInTheDocument();
  });
});
