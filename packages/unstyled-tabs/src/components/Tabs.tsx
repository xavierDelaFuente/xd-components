import {
  type ComponentPropsWithoutRef,
  type ForwardedRef,
  forwardRef,
  type ReactNode,
  useId,
  useMemo,
} from 'react';
import { TabsContext } from './TabsContext';
import { useTabsValue } from './useTabsValue';

export type TabsProps = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
} & Omit<
  ComponentPropsWithoutRef<'div'>,
  'onChange' | 'defaultValue' | 'children'
>;

function TabsInner(
  { value, defaultValue, onValueChange, children, ...rest }: TabsProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const baseId = useId();
  const { activeValue, setActiveValue } = useTabsValue({
    value,
    defaultValue,
    onValueChange,
  });

  const contextValue = useMemo(
    () => ({ baseId, activeValue, setActiveValue }),
    [baseId, activeValue, setActiveValue],
  );

  return (
    <TabsContext.Provider value={contextValue}>
      <div {...rest} ref={ref}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(TabsInner);
