import { Tab, TabList, TabPanel, Tabs } from '@asnewyla/tabs';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
};

export default meta;

export const Default: StoryObj = {
  render: () => (
    <Tabs defaultValue="profile" style={{ width: 360 }}>
      <TabList aria-label="Account settings">
        <Tab value="profile">Profile</Tab>
        <Tab value="settings">Settings</Tab>
        <Tab value="billing">Billing</Tab>
      </TabList>
      <TabPanel value="profile">
        Update your name, photo, and public profile details here.
      </TabPanel>
      <TabPanel value="settings">
        Manage notification preferences and connected accounts.
      </TabPanel>
      <TabPanel value="billing">
        View invoices and update your payment method.
      </TabPanel>
    </Tabs>
  ),
};

export const WithDisabledTab: StoryObj = {
  render: () => (
    <Tabs defaultValue="profile" style={{ width: 360 }}>
      <TabList aria-label="Account settings">
        <Tab value="profile">Profile</Tab>
        <Tab value="settings">Settings</Tab>
        <Tab value="billing" disabled>
          Billing
        </Tab>
      </TabList>
      <TabPanel value="profile">
        Update your name, photo, and public profile details here.
      </TabPanel>
      <TabPanel value="settings">
        Manage notification preferences and connected accounts.
      </TabPanel>
      <TabPanel value="billing">
        Billing is only available on a paid plan.
      </TabPanel>
    </Tabs>
  ),
};

// Controlled usage — the consumer owns `value` and can drive it from
// anywhere, not just clicks on the tabs themselves (here, a plain button).
function ControlledDemo() {
  const [active, setActive] = useState('profile');

  return (
    <div style={{ width: 360 }}>
      <p>
        Active: <strong>{active}</strong>{' '}
        <button type="button" onClick={() => setActive('billing')}>
          Jump to Billing
        </button>
      </p>
      <Tabs value={active} onValueChange={setActive}>
        <TabList aria-label="Account settings">
          <Tab value="profile">Profile</Tab>
          <Tab value="settings">Settings</Tab>
          <Tab value="billing">Billing</Tab>
        </TabList>
        <TabPanel value="profile">Profile content</TabPanel>
        <TabPanel value="settings">Settings content</TabPanel>
        <TabPanel value="billing">Billing content</TabPanel>
      </Tabs>
    </div>
  );
}

export const Controlled: StoryObj = {
  render: () => <ControlledDemo />,
};
