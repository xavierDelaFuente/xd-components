import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { Select } from '@asnewyla/select';
import { Stack } from '@asnewyla/layout';

const fruitOptions = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry', disabled: true },
  { value: 'durian', label: 'Durian' },
];

// The popup is `position: absolute`, so opening it doesn't grow the
// story's normal-flow height the way Storybook's docs-page iframe sizing
// expects — without this, the open listbox gets clipped into a scrollable
// box instead of the iframe growing to fit it. Reserving the space up
// front (label + trigger + a fully open popup) sidesteps that rather than
// relying on interaction-triggered resize. Pulled out to a named,
// explicitly-typed `Decorator` — inlined in `meta.decorators`, an
// untyped arrow collapses `StoryObj<typeof meta>`'s inferred args to
// `never`, since `Select`'s discriminated-union props don't survive
// Storybook's own generic inference through an untyped decorator.
const reserveOpenPopupSpace: Decorator = (Story) => (
  <div style={{ minHeight: 340, minWidth: 260 }}>
    <Story />
  </div>
);

const meta = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  decorators: [reserveOpenPopupSpace],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Fruit',
    options: fruitOptions,
    placeholder: 'Choose a fruit',
  },
};

export const WithSelection: Story = {
  args: {
    label: 'Fruit',
    options: fruitOptions,
    defaultValue: 'banana',
  },
};

export const WithError: Story = {
  args: {
    label: 'Fruit',
    options: fruitOptions,
    placeholder: 'Choose a fruit',
    error: 'Pick a fruit to continue',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Fruit',
    options: fruitOptions,
    disabled: true,
    defaultValue: 'banana',
  },
};

export const MultiSelect: Story = {
  args: {
    label: 'Fruit',
    options: fruitOptions,
    multiple: true,
    defaultValue: ['apple', 'banana'],
    placeholder: 'Choose fruits',
  },
};

export const MultiSelectEmpty: Story = {
  args: {
    label: 'Fruit',
    options: fruitOptions,
    multiple: true,
    placeholder: 'Choose fruits',
  },
};

export const InAStack: StoryObj = {
  render: () => (
    <Stack gap="md" style={{ width: 280 }}>
      <Select
        label="Fruit"
        options={fruitOptions}
        placeholder="Choose a fruit"
      />
      <Select
        label="Toppings"
        options={fruitOptions}
        multiple
        defaultValue={['apple', 'banana']}
        placeholder="Choose toppings"
      />
      <Select
        label="Required fruit"
        options={fruitOptions}
        placeholder="Choose a fruit"
        error="This field is required"
      />
    </Stack>
  ),
};
