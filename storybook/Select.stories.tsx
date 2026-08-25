import type { Meta, StoryObj } from '@storybook/react-vite';
import { Select } from '@asnewyla/select';
import { Stack } from '@asnewyla/layout';

const fruitOptions = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry', disabled: true },
  { value: 'durian', label: 'Durian' },
];

const meta = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
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
