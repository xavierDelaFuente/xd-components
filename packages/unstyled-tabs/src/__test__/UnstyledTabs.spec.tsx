import { render } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Tab, TabList, TabPanel, Tabs } from '../components';
import { getAllTabs, getPanel, getTab, getTabList } from '../test-utils';

let user: UserEvent;

beforeEach(() => {
  user = userEvent.setup();
});

// Shared 3-tab fixture — "Billing" is disabled, used throughout to prove
// keyboard nav and click-activation both correctly skip it.
function renderTabs(props: Partial<React.ComponentProps<typeof Tabs>> = {}) {
  return render(
    <Tabs defaultValue="profile" {...props}>
      <TabList aria-label="Account settings">
        <Tab value="profile">Profile</Tab>
        <Tab value="settings">Settings</Tab>
        <Tab value="billing" disabled>
          Billing
        </Tab>
      </TabList>
      <TabPanel value="profile">Profile content</TabPanel>
      <TabPanel value="settings">Settings content</TabPanel>
      <TabPanel value="billing">Billing content</TabPanel>
    </Tabs>,
  );
}

describe('UnstyledTabs', () => {
  it('renders a tablist with each tab', () => {
    renderTabs();

    expect(getTabList()).toBeInTheDocument();
    expect(getAllTabs()).toHaveLength(3);
  });

  it('renders only the active panel — inactive panels are not in the DOM', () => {
    renderTabs();

    // A tabpanel's accessible name comes from aria-labelledby (the tab's
    // own label, "Profile"), not the panel's own body text — that's
    // checked separately via toHaveTextContent.
    expect(getPanel('Profile')).toHaveTextContent('Profile content');
    expect(getAllTabs()).toHaveLength(3);
    expect(document.querySelectorAll('[role="tabpanel"]')).toHaveLength(1);
  });

  it('is uncontrolled by default — defaultValue sets the initially active tab', () => {
    renderTabs({ defaultValue: 'settings' });

    expect(getTab('Settings')).toHaveAttribute('aria-selected', 'true');
    expect(getPanel('Settings')).toHaveTextContent('Settings content');
  });

  it('activates a tab and shows its panel when clicked', async () => {
    renderTabs();

    await user.click(getTab('Settings'));

    expect(getTab('Settings')).toHaveAttribute('aria-selected', 'true');
    expect(getPanel('Settings')).toHaveTextContent('Settings content');
  });

  it('supports controlled usage via value + onValueChange', async () => {
    const handleChange = vi.fn();
    renderTabs({ value: 'profile', onValueChange: handleChange });

    await user.click(getTab('Settings'));

    expect(handleChange).toHaveBeenCalledWith('settings');
    // still on profile — nothing fed the new value back in via props
    expect(getTab('Profile')).toHaveAttribute('aria-selected', 'true');
  });

  it('sets aria-selected="false" on every inactive tab', () => {
    renderTabs();

    expect(getTab('Settings')).toHaveAttribute('aria-selected', 'false');
    expect(getTab('Billing')).toHaveAttribute('aria-selected', 'false');
  });

  it('gives only the active tab tabIndex 0 — roving tabindex', () => {
    renderTabs();

    expect(getTab('Profile')).toHaveAttribute('tabindex', '0');
    expect(getTab('Settings')).toHaveAttribute('tabindex', '-1');
    expect(getTab('Billing')).toHaveAttribute('tabindex', '-1');
  });

  it('moves the roving tabindex when a different tab is clicked', async () => {
    renderTabs();

    await user.click(getTab('Settings'));

    expect(getTab('Settings')).toHaveAttribute('tabindex', '0');
    expect(getTab('Profile')).toHaveAttribute('tabindex', '-1');
  });

  it('ArrowRight moves focus to the next tab and activates it', async () => {
    renderTabs();
    getTab('Profile').focus();

    await user.keyboard('{ArrowRight}');

    expect(getTab('Settings')).toHaveFocus();
    expect(getTab('Settings')).toHaveAttribute('aria-selected', 'true');
  });

  it('ArrowLeft moves focus to the previous tab and activates it', async () => {
    renderTabs({ defaultValue: 'settings' });
    getTab('Settings').focus();

    await user.keyboard('{ArrowLeft}');

    expect(getTab('Profile')).toHaveFocus();
    expect(getTab('Profile')).toHaveAttribute('aria-selected', 'true');
  });

  it('ArrowRight skips a disabled tab', async () => {
    renderTabs({ defaultValue: 'settings' });
    getTab('Settings').focus();

    await user.keyboard('{ArrowRight}');

    // Billing is disabled — wraps around to Profile instead
    expect(getTab('Profile')).toHaveFocus();
  });

  it('ArrowLeft wraps from the first tab to the last enabled tab', async () => {
    renderTabs();
    getTab('Profile').focus();

    await user.keyboard('{ArrowLeft}');

    // Billing is disabled — lands on Settings instead
    expect(getTab('Settings')).toHaveFocus();
  });

  it('Home moves focus to the first tab', async () => {
    renderTabs({ defaultValue: 'settings' });
    getTab('Settings').focus();

    await user.keyboard('{Home}');

    expect(getTab('Profile')).toHaveFocus();
  });

  it('End moves focus to the last enabled tab', async () => {
    renderTabs();
    getTab('Profile').focus();

    await user.keyboard('{End}');

    // Billing is disabled — lands on Settings instead
    expect(getTab('Settings')).toHaveFocus();
  });

  it('does not activate a disabled tab when clicked', async () => {
    renderTabs();

    await user.click(getTab('Billing'));

    expect(getTab('Profile')).toHaveAttribute('aria-selected', 'true');
    expect(getPanel('Profile')).toHaveTextContent('Profile content');
  });

  it('marks a disabled tab with the native disabled attribute', () => {
    renderTabs();

    expect(getTab('Billing')).toBeDisabled();
  });

  it('links each tab to its panel via aria-controls', () => {
    renderTabs();

    const tab = getTab('Profile');
    const panel = getPanel('Profile');

    expect(tab).toHaveAttribute('aria-controls', panel.id);
  });

  it('links each panel back to its tab via aria-labelledby', () => {
    renderTabs();

    const tab = getTab('Profile');
    const panel = getPanel('Profile');

    expect(panel).toHaveAttribute('aria-labelledby', tab.id);
  });

  it('passes through arbitrary native attributes on TabList', () => {
    renderTabs();

    expect(getTabList()).toHaveAttribute('aria-label', 'Account settings');
  });
});
