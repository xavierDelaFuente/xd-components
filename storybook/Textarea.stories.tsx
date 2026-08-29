import { Stack } from '@asnewyla/layout';
import { Textarea } from '@asnewyla/textarea';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/Textarea',
  component: Textarea,
  tags: ['autodocs'],
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Bio',
    placeholder: 'Tell us about yourself',
  },
};

export const WithValue: Story = {
  args: {
    label: 'Bio',
    defaultValue:
      'Long-time contributor to open source design systems, currently exploring accessible component libraries.',
  },
};

export const WithError: Story = {
  args: {
    label: 'Bio',
    placeholder: 'Tell us about yourself',
    error: 'Bio is required',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Bio',
    disabled: true,
    defaultValue: 'This field is currently locked.',
  },
};

export const CustomRows: Story = {
  args: {
    label: 'Cover letter',
    rows: 10,
    placeholder: 'Write your cover letter here',
  },
};

export const InAStack: StoryObj = {
  render: () => (
    <Stack gap="md" style={{ width: 320 }}>
      <Textarea label="Summary" rows={3} placeholder="Short summary" />
      <Textarea
        label="Bio"
        error="Bio is required"
        placeholder="Tell us about yourself"
      />
    </Stack>
  ),
};
