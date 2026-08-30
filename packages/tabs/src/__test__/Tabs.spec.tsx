import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Tab, TabList, TabPanel, Tabs } from '../components';

function renderTabs() {
  return render(
    <Tabs defaultValue="profile">
      <TabList aria-label="Account settings">
        <Tab value="profile">Profile</Tab>
        <Tab value="settings">Settings</Tab>
      </TabList>
      <TabPanel value="profile">Profile content</TabPanel>
      <TabPanel value="settings">Settings content</TabPanel>
    </Tabs>,
  );
}

describe('Tabs', () => {
  it('applies the base xd-tabs class even without a consumer className', () => {
    const { container } = renderTabs();

    expect(container.firstElementChild).toHaveClass('xd-tabs');
  });

  it('merges a consumer className onto Tabs, base class first', () => {
    const { container } = render(
      <Tabs defaultValue="profile" className="my-tabs">
        <TabList aria-label="Account settings">
          <Tab value="profile">Profile</Tab>
        </TabList>
        <TabPanel value="profile">Profile content</TabPanel>
      </Tabs>,
    );

    expect(container.firstElementChild).toHaveClass('xd-tabs', 'my-tabs');
  });

  it('forwards a ref to the Tabs root element', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Tabs defaultValue="profile" ref={ref}>
        <TabList aria-label="Account settings">
          <Tab value="profile">Profile</Tab>
        </TabList>
        <TabPanel value="profile">Profile content</TabPanel>
      </Tabs>,
    );

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('passes through arbitrary native attributes on Tabs', () => {
    const { container } = render(
      <Tabs defaultValue="profile" id="account-tabs">
        <TabList aria-label="Account settings">
          <Tab value="profile">Profile</Tab>
        </TabList>
        <TabPanel value="profile">Profile content</TabPanel>
      </Tabs>,
    );

    expect(container.firstElementChild).toHaveAttribute('id', 'account-tabs');
  });

  it('applies the base xd-tab-list class even without a consumer className', () => {
    renderTabs();

    expect(screen.getByRole('tablist')).toHaveClass('xd-tab-list');
  });

  it('merges a consumer className onto TabList, base class first', () => {
    render(
      <Tabs defaultValue="profile">
        <TabList aria-label="Account settings" className="my-tab-list">
          <Tab value="profile">Profile</Tab>
        </TabList>
        <TabPanel value="profile">Profile content</TabPanel>
      </Tabs>,
    );

    expect(screen.getByRole('tablist')).toHaveClass(
      'xd-tab-list',
      'my-tab-list',
    );
  });

  it('forwards a ref to the TabList element', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Tabs defaultValue="profile">
        <TabList aria-label="Account settings" ref={ref}>
          <Tab value="profile">Profile</Tab>
        </TabList>
        <TabPanel value="profile">Profile content</TabPanel>
      </Tabs>,
    );

    expect(ref.current).toBe(screen.getByRole('tablist'));
  });

  it('passes through arbitrary native attributes on TabList', () => {
    renderTabs();

    expect(screen.getByRole('tablist')).toHaveAttribute(
      'aria-label',
      'Account settings',
    );
  });

  it('applies the base xd-tab class even without a consumer className', () => {
    renderTabs();

    expect(screen.getByRole('tab', { name: 'Profile' })).toHaveClass('xd-tab');
  });

  it('merges a consumer className onto Tab, base class first', () => {
    render(
      <Tabs defaultValue="profile">
        <TabList aria-label="Account settings">
          <Tab value="profile" className="my-tab">
            Profile
          </Tab>
        </TabList>
        <TabPanel value="profile">Profile content</TabPanel>
      </Tabs>,
    );

    expect(screen.getByRole('tab', { name: 'Profile' })).toHaveClass(
      'xd-tab',
      'my-tab',
    );
  });

  it('forwards a ref to a Tab element', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Tabs defaultValue="profile">
        <TabList aria-label="Account settings">
          <Tab value="profile" ref={ref}>
            Profile
          </Tab>
        </TabList>
        <TabPanel value="profile">Profile content</TabPanel>
      </Tabs>,
    );

    expect(ref.current).toBe(screen.getByRole('tab', { name: 'Profile' }));
  });

  it('passes through arbitrary native attributes on Tab', () => {
    render(
      <Tabs defaultValue="profile">
        <TabList aria-label="Account settings">
          <Tab value="profile" title="Your profile">
            Profile
          </Tab>
        </TabList>
        <TabPanel value="profile">Profile content</TabPanel>
      </Tabs>,
    );

    expect(screen.getByRole('tab', { name: 'Profile' })).toHaveAttribute(
      'title',
      'Your profile',
    );
  });

  it('applies the base xd-tab-panel class even without a consumer className', () => {
    renderTabs();

    expect(screen.getByRole('tabpanel')).toHaveClass('xd-tab-panel');
  });

  it('merges a consumer className onto TabPanel, base class first', () => {
    render(
      <Tabs defaultValue="profile">
        <TabList aria-label="Account settings">
          <Tab value="profile">Profile</Tab>
        </TabList>
        <TabPanel value="profile" className="my-panel">
          Profile content
        </TabPanel>
      </Tabs>,
    );

    expect(screen.getByRole('tabpanel')).toHaveClass(
      'xd-tab-panel',
      'my-panel',
    );
  });

  it('forwards a ref to the active TabPanel element', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Tabs defaultValue="profile">
        <TabList aria-label="Account settings">
          <Tab value="profile">Profile</Tab>
        </TabList>
        <TabPanel value="profile" ref={ref}>
          Profile content
        </TabPanel>
      </Tabs>,
    );

    expect(ref.current).toBe(screen.getByRole('tabpanel'));
  });

  it('passes through arbitrary native attributes on TabPanel', () => {
    render(
      <Tabs defaultValue="profile">
        <TabList aria-label="Account settings">
          <Tab value="profile">Profile</Tab>
        </TabList>
        <TabPanel value="profile" title="Your profile">
          Profile content
        </TabPanel>
      </Tabs>,
    );

    expect(screen.getByRole('tabpanel')).toHaveAttribute(
      'title',
      'Your profile',
    );
  });

  it('actually switches panels when a tab is clicked, like the primitive', async () => {
    const user = userEvent.setup();
    renderTabs();

    expect(screen.getByRole('tabpanel')).toHaveTextContent('Profile content');

    await user.click(screen.getByRole('tab', { name: 'Settings' }));

    expect(screen.getByRole('tabpanel')).toHaveTextContent('Settings content');
  });
});
