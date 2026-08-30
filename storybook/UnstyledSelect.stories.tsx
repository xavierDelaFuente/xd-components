import { UnstyledSelect } from '@asnewyla/unstyled-select';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties } from 'react';

// Genuinely unstyled — no CSS at all. This inline style exists only so the
// trigger/listbox boundaries are visible in Storybook; it is not part of
// the package and a real consumer would supply their own.
const triggerStyle: CSSProperties = {
  display: 'inline-block',
  minWidth: 200,
  border: '1px solid #94a3b8',
  padding: '6px 10px',
  cursor: 'pointer',
};

const fruitOptions = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry', disabled: true },
  { value: 'durian', label: 'Durian' },
];

const meta = {
  title: 'Primitives/UnstyledSelect',
  component: UnstyledSelect,
  tags: ['autodocs'],
  args: {
    style: triggerStyle,
  },
} satisfies Meta<typeof UnstyledSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    'aria-label': 'Fruit',
    options: fruitOptions,
    placeholder: 'Choose a fruit',
  },
};

export const WithSelection: Story = {
  args: {
    'aria-label': 'Fruit',
    options: fruitOptions,
    defaultValue: 'banana',
  },
};

export const MultiSelect: Story = {
  args: {
    'aria-label': 'Fruit',
    options: fruitOptions,
    multiple: true,
    defaultValue: ['apple', 'banana'],
    placeholder: 'Choose fruits',
  },
};

export const Disabled: Story = {
  args: {
    'aria-label': 'Fruit',
    options: fruitOptions,
    disabled: true,
    placeholder: 'Choose a fruit',
  },
};

export const Invalid: Story = {
  args: {
    'aria-label': 'Fruit',
    options: fruitOptions,
    invalid: true,
    placeholder: 'Choose a fruit',
  },
};

// `renderValue` is the hook `@asnewyla/select`'s chips are built on — this
// shows the primitive's own contract for it, with the plainest possible
// rendering. The `<button>` here is native ON PURPOSE: the whole point of the
// story is what you get from the unstyled primitive with zero component help.
// (Stories otherwise use @asnewyla components, not raw elements — see PROJECT.md.)
export const CustomRenderValue: StoryObj = {
  render: () => (
    <UnstyledSelect
      aria-label="Fruit"
      options={fruitOptions}
      multiple
      defaultValue={['apple', 'banana']}
      placeholder="Choose fruits"
      style={triggerStyle}
      renderValue={(selectedOptions, { removeOption }) =>
        selectedOptions.length > 0
          ? selectedOptions.map((option) => (
              <span key={option.value} style={{ marginRight: 8 }}>
                {option.label}
                <button
                  type="button"
                  aria-label={`Remove ${option.label}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeOption(option);
                  }}
                >
                  ×
                </button>
              </span>
            ))
          : 'Choose fruits'
      }
    />
  ),
};
