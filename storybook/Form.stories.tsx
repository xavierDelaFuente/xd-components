import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@asnewyla/button';
import { Form, FormFieldInput } from '@asnewyla/form';
import { Input } from '@asnewyla/input';
import { Stack } from '@asnewyla/layout';

const meta = {
  title: 'Components/Form',
  component: Form,
  tags: ['autodocs'],
} satisfies Meta<typeof Form>;

export default meta;

export const Default: StoryObj = {
  render: () => (
    <Form onSubmit={(values) => alert(JSON.stringify(values, null, 2))}>
      <Stack gap="md" style={{ width: 320 }}>
        <FormFieldInput label="Name" name="name" required />
        <FormFieldInput
          label="Email"
          name="email"
          required
          pattern="^\S+@\S+$"
        />
        <Button type="submit">Submit</Button>
      </Stack>
    </Form>
  ),
};

export const ValidationRules: StoryObj = {
  render: () => (
    <Form onSubmit={(values) => alert(JSON.stringify(values, null, 2))}>
      <Stack gap="md" style={{ width: 320 }}>
        <FormFieldInput
          label="Username"
          name="username"
          required
          minLength={3}
          maxLength={16}
        />
        <FormFieldInput label="Age" name="age" type="number" min={18} max={120} />
        <FormFieldInput
          label="Handle"
          name="handle"
          validate={(value) =>
            value !== '' && !value.startsWith('@')
              ? 'Must start with @'
              : undefined
          }
        />
        <Button type="submit">Submit</Button>
      </Stack>
    </Form>
  ),
};

// Fields start already invalid — submit right away to see the error summary
// (role="alert", one link per invalid field, focus moved to it) without
// needing to type anything first.
export const ErrorSummaryOnFailedSubmit: StoryObj = {
  render: () => (
    <Form onSubmit={(values) => alert(JSON.stringify(values, null, 2))}>
      <Stack gap="md" style={{ width: 320 }}>
        <FormFieldInput label="Name" name="name" required defaultValue="" />
        <FormFieldInput
          label="Email"
          name="email"
          required
          pattern="^\S+@\S+$"
          defaultValue="not-an-email"
        />
        <Button type="submit">Submit</Button>
      </Stack>
    </Form>
  ),
};

// A plain Input (not FormFieldInput) inside a Form is never registered or
// validated, but native <form> semantics still collect its value into
// onSubmit via FormData — accepted, intentional behavior, not a bug.
export const UnregisteredFieldInsideForm: StoryObj = {
  render: () => (
    <Form onSubmit={(values) => alert(JSON.stringify(values, null, 2))}>
      <Stack gap="md" style={{ width: 320 }}>
        <FormFieldInput label="Name" name="name" required />
        <Input label="Referral code (not validated)" name="referral" />
        <Button type="submit">Submit</Button>
      </Stack>
    </Form>
  ),
};
