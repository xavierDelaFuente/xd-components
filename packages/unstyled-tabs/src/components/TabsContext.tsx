import { createContext, useContext } from 'react';

export type TabsContextValue = {
  baseId: string;
  activeValue: string | undefined;
  setActiveValue: (value: string) => void;
};

export const TabsContext = createContext<TabsContextValue | null>(null);

export function useTabsContext(): TabsContextValue {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error(
      'Tabs compound components (TabList, Tab, TabPanel) must be rendered inside <Tabs>',
    );
  }
  return context;
}

// Tab and TabPanel each derive matching ids independently from the same
// (baseId, value) pair — no registration step needed for aria-controls/
// aria-labelledby to cross-reference correctly.
export function getTabId(baseId: string, value: string): string {
  return `${baseId}-tab-${value}`;
}

export function getPanelId(baseId: string, value: string): string {
  return `${baseId}-panel-${value}`;
}
